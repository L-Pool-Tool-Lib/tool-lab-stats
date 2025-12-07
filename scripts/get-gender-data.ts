import dotenv from "dotenv";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import process from "process";
import { getCookies } from "./get-cookies.ts";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseDateStrict(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${input}`);
  // normalize to start of day UTC-equivalent (but keep local date semantics)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function formatYMD(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDMY(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
}

async function main() {
  dotenv.config();

  const {
    GATSBY_RANGE_START_DATE,
    GATSBY_RANGE_END_DATE,
    GATSBY_STEP_SIZE_IN_DAYS,
    MT_API_URL,
    AGGREGATE_ATTRIBUTE,
  } = process.env;

  if (
    !GATSBY_RANGE_START_DATE ||
    !GATSBY_RANGE_END_DATE ||
    !GATSBY_STEP_SIZE_IN_DAYS
  ) {
    console.error(
      "Missing GATSBY_RANGE_START_DATE, GATSBY_RANGE_END_DATE or GATSBY_STEP_SIZE_IN_DAYS in env"
    );
    process.exit(1);
  }
  if (!MT_API_URL || !AGGREGATE_ATTRIBUTE) {
    console.error("Missing MT_API_URL, COOKIE or AGGREGATE_ATTRIBUTE in env");
    process.exit(1);
  }

  const stepDays = parseInt(GATSBY_STEP_SIZE_IN_DAYS, 10);
  if (Number.isNaN(stepDays) || stepDays <= 0) {
    console.error("GATSBY_STEP_SIZE_IN_DAYS must be a positive integer");
    process.exit(1);
  }

    const COOKIE = await getCookies();
  

  let startDate = parseDateStrict(GATSBY_RANGE_START_DATE);
  let endDate = addDays(startDate, stepDays);
  const rangeEndDate = parseDateStrict(GATSBY_RANGE_END_DATE);

  const outDirBase = join(process.cwd(), "data", AGGREGATE_ATTRIBUTE);
  mkdirSync(outDirBase, { recursive: true });

  while (addDays(endDate, stepDays).getTime() <= rangeEndDate.getTime()) {
    console.log(`Starting, getting: ${formatYMD(startDate)}`);

    const formattedStart = formatDMY(startDate);
    const formattedEnd = formatDMY(endDate);

    const url = `https://${MT_API_URL}/library/orgLoan/exportAggregateLoanReport`;

    const headers: Record<string, string> = {
      Host: MT_API_URL,
      Accept: "*/*",
      "Accept-Language": "en-GB,en;q=0.7,fr;q=0.3",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: `https://${MT_API_URL}/`,
      "User-Agent": "nodeJS for ltl-usage-graph",
      "Content-type": "application/x-www-form-urlencoded",
      Origin: `https://${MT_API_URL}`,
      DNT: "1",
      Connection: "keep-alive",
      Cookie: COOKIE,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      host: MT_API_URL,
    };

    const params = new URLSearchParams();
    params.set("from_date", formattedStart);
    params.set("from", "struct");
    params.set("from_tz", "Europe/London");
    params.set("from_time", "00:00");
    params.set("to_date", formattedEnd);
    params.set("to", "struct");
    params.set("to_tz", "Europe/London");
    params.set("to_time", "23:59");
    params.set("aggregateAttribute", AGGREGATE_ATTRIBUTE);
    params.set("location.id", "2806");
    params.set("format", "csv");
    params.set("extension", "csv");

    let resp;
    try {
      resp = await fetch(url, {
        method: "POST",
        headers,
        body: params.toString(),
      });
    } catch (err) {
      console.error("Fetch failed:", String(err));
      process.exit(1);
    }

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error(`Request failed: ${resp.status} ${resp.statusText}`);
      if (text) console.error(text.slice(0, 500));
      process.exit(1);
    }

    const outName = `${formatYMD(startDate)}-to-${formatYMD(endDate)}.csv`;
    const outPath = join(outDirBase, outName);
    const buffer = Buffer.from(await resp.arrayBuffer());
    writeFileSync(outPath, buffer);
    // sleep 3 seconds like the original
    await sleep(3000);

    // Increment dates matching original script logic
    startDate = addDays(endDate, 1); // start_date=$(date --date "$end_date +1 day")
    endDate = addDays(startDate, stepDays);
  }

  console.log("Done.");
}

// if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
// }
