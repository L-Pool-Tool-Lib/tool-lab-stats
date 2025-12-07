import path from "path";

// Note: this script uses the Node polars bindings. Install with:
//    npm install polars
// or
//    yarn add polars
import pl from "nodejs-polars";

async function main() {
  const input = path.join(process.cwd(), "data", "sex", "collection.csv");
  const output = path.join(process.cwd(), "src", "data", "gender.csv");

  // Read CSV
  const df = pl.readCSV(input, { tryParseDates: false });

  // 1) Clean Filename: remove prefix/suffix
  const df1 = df.withColumns([
    pl
      .col("Filename")
      .str()
      .replaceAll("data/sex/", "")
      .replaceAll(".csv", "")
      .alias("Filename_clean"),
  ]);

  // 2) Split Filename_clean into Start Date and End Date, drop original
  const df2 = df1.withColumns([
    pl.col("Filename_clean").str().splitExact("-to-", 2).arr().get(0).alias("Start Date"),
    pl.col("Filename_clean").str().splitExact("-to-", 2).arr().get(1).alias("End Date"),
  ]).drop(["Filename", "Filename_clean"]);

  // 3) Reformat Start/End dates from YYYY-MM-DD to DD/MM/YYYY if needed
  const df3 = df2.withColumns([
    pl
      .col("End Date")
      .str()
      .replaceAll(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1")
      .alias("End Date"),
    pl
      .col("Start Date")
      .str()
      .replaceAll(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1")
      .alias("Start Date"),
  ]);

  // 4) One-hot encode 'Value'
  // polars JS exposes getDummies on a DataFrame
  // create dummies df for the Value column
  const dummies = df3.getDummies({ columns: ["Value"] });

  // Merge dummies back with the rest of the data (drop original Value then concat)
  const base = df3.drop(["Value"]);
  const merged = pl.concat([base, dummies], { how: "horizontal" });

  // 5) Rename awkward column if present
  let df4 = merged;
  if (df4.columns.includes("Value_would rather not say")) {
    df4 = df4.rename({
      "Value_would rather not say": "Value_would_rather_not_say",
    });
  }

  // 6) Ensure Count is numeric
  df4 = df4.withColumn(pl.col("Count").cast(pl.Int64));

  // 7) Convert boolean-like dummy columns to integers if necessary
  const boolToIntCols = df4.columns.filter((c) => c.startsWith("Value_"));
  const castExprs = boolToIntCols.map((c) =>
    pl.col(c).cast(pl.Int64).alias(c)
  );
  df4 = df4.withColumns(castExprs);

  // 8) Create aggregated gender columns
  const withGender = df4.withColumns([
    pl
      .col("Value_male")
      .fillNull(0)
      .mul(pl.col("Count"))
      .cast(pl.Int64)
      .alias("male"),
    pl
      .col("Value_female")
      .fillNull(0)
      .mul(pl.col("Count"))
      .cast(pl.Int64)
      .alias("female"),
    pl
      .col("Value_[None]")
      .fillNull(0)
      .mul(pl.col("Count"))
      .cast(pl.Int64)
      .alias("none"),
    pl
      .col("Value_other")
      .fillNull(0)
      .mul(pl.col("Count"))
      .cast(pl.Int64)
      .alias("other"),
    pl
      .col("Value_would_rather_not_say")
      .fillNull(0)
      .mul(pl.col("Count"))
      .cast(pl.Int64)
      .alias("would_rather_not_say"),
  ]);

  // 9) Drop intermediate Value_* and Amount
  const dropCols = [
    "Value_[None]",
    "Value_female",
    "Value_male",
    "Value_other",
    "Value_would_rather_not_say",
    "Amount",
  ].filter((c) => withGender.columns.includes(c));
  const df5 = withGender.drop(dropCols);

  // 10) Clone Start Date as start_date_time and convert format to YYYY-MM-DD
  const df6 = df5.withColumns([
    pl
      .col("Start Date")
      .alias("start_date_time")
      .str()
      .replaceAll(/^(\d{2})\/(\d{2})\/(\d{4})$/, "$3-$2-$1"),
  ]);

  // 11) Ensure numeric types
  const final = df6.withColumns([
    pl.col("female").cast(pl.Int64),
    pl.col("none").cast(pl.Int64),
    pl.col("male").cast(pl.Int64),
    pl.col("other").cast(pl.Int64),
    pl.col("would_rather_not_say").cast(pl.Int64),
  ]);

  // 12) Group by start_date_time and aggregate
  const grouped = final
    .groupBy(["start_date_time"])
    .agg([
      pl.col("Start Date").first().alias("StartDate_first"),
      pl.col("End Date").first().alias("EndDate_first"),
      pl.col("male").sum().alias("male_sum"),
      pl.col("female").sum().alias("female_sum"),
      pl.col("none").sum().alias("none_sum"),
      pl.col("would_rather_not_say").sum().alias("would_rather_not_say_sum"),
      pl.col("Count").sum().alias("Count_sum"),
    ])
    .sort("start_date_time");

  // Write out CSV
  await pl.writeCSV(grouped, output);

  console.log(`Wrote cleaned gender CSV to ${output}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
