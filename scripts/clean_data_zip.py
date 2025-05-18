import pandas as pd


def clean_data(df):
    # Clean date
    df["Filename"] = df["Filename"].str.replace(
        "data/zip/|\\.csv", "", case=False, regex=True
    )
    # Split text using string '-to-' in column: 'Filename'
    loc_0 = df.columns.get_loc("Filename")
    df_split = df["Filename"].str.split(pat="-to-", expand=True).add_prefix("Filename_")
    df = pd.concat([df.iloc[:, :loc_0], df_split, df.iloc[:, loc_0:]], axis=1)
    df = df.drop(columns=["Filename"])
    # Rename column 'Filename_0' to 'Start Date'
    df = df.rename(columns={"Filename_0": "Start Date"})
    # Rename column 'Filename_1' to 'End Date'
    df = df.rename(columns={"Filename_1": "End Date"})
    # Replace all instances of "(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)" with "\\3/\\2/\\1" in columns: 'End Date', 'Start Date'
    df["End Date"] = df["End Date"].str.replace(
        "(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)", "\\3/\\2/\\1", case=False, regex=True
    )
    df["Start Date"] = df["Start Date"].str.replace(
        "(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)", "\\3/\\2/\\1", case=False, regex=True
    )

    # Clone column 'Value' as 'Postcode'
    df["Postcode"] = df.loc[:, "Value"]
    # Convert text to uppercase in column: 'Postcode'
    df["Postcode"] = df["Postcode"].str.upper()
    # Created column 'Outward Code' from formula
    df["Outward Code"] = df["Postcode"].str.replace(
        "\s*([A-Z0-9]{3})$", "", case=False, regex=True
    )
    df["Outward Code"] = df["Outward Code"].str.replace(
        " .+$", "", case=False, regex=True
    )

    # Drop columns: 'Amount', 'Value', 'Postcode'
    df = df.drop(columns=["Amount", "Value", "Postcode"])
    # Performed 1 aggregation grouped on columns: 'Start Date', 'End Date', 'Outward Code'
    df = (
        df.groupby(["Start Date", "End Date", "Outward Code"])
        .agg(Count_sum=("Count", "sum"))
        .reset_index()
    )

    # Clone column 'Start Date' as 'start_date_time'
    df["start_date_time"] = df.loc[:, "Start Date"]
    # Replace all instances of "(\\d\\d)/(\\d\\d)/(\\d\\d\\d\\d)" with "\\3-\\2-\\1" in column: 'start_date_time'
    df["start_date_time"] = df["start_date_time"].str.replace(
        "^(\\d\\d)/(\\d\\d)/(\\d\\d\\d\\d)$", "\\3-\\2-\\1", case=False, regex=True
    )
    df["start_date_time"] = df.loc[:, "Start Date"]
    # Replace all instances of "(\\d\\d)/(\\d\\d)/(\\d\\d\\d\\d)" with "\\3-\\2-\\1" in column: 'start_date_time'
    df["start_date_time"] = df["start_date_time"].str.replace(
        "^(\\d\\d)/(\\d\\d)/(\\d\\d\\d\\d)$", "\\3-\\2-\\1", case=False, regex=True
    )
    # Sort by column: 'start_date_time' (ascending)
    df = df.sort_values(["start_date_time"])
    df = df.sort_values(["start_date_time"])
    # One-hot encode column: 'Outward Code'
    insert_loc = df.columns.get_loc("Outward Code")
    df = pd.concat(
        [
            df.iloc[:, :insert_loc],
            pd.get_dummies(df.loc[:, ["Outward Code"]]),
            df.iloc[:, insert_loc + 1 :],
        ],
        axis=1,
    )
    # Change column type to int64 for columns: 'Outward Code_CA5', 'Outward Code_L8' and 57 other columns
    df = df.astype(
        {
            "Outward Code_CA5": "int64",
            "Outward Code_CH2": "int64",
            "Outward Code_CH41": "int64",
            "Outward Code_CH42": "int64",
            "Outward Code_CH43": "int64",
            "Outward Code_CH45": "int64",
            "Outward Code_CH46": "int64",
            "Outward Code_CH47": "int64",
            "Outward Code_CH49": "int64",
            "Outward Code_CH60": "int64",
            "Outward Code_CH61": "int64",
            "Outward Code_CH62": "int64",
            "Outward Code_CH63": "int64",
            "Outward Code_L1": "int64",
            "Outward Code_L11": "int64",
            "Outward Code_L12": "int64",
            "Outward Code_L13": "int64",
            "Outward Code_L14": "int64",
            "Outward Code_L15": "int64",
            "Outward Code_L16": "int64",
            "Outward Code_L17": "int64",
            "Outward Code_L18": "int64",
            "Outward Code_L19": "int64",
            "Outward Code_L2": "int64",
            "Outward Code_L20": "int64",
            "Outward Code_L21": "int64",
            "Outward Code_L22": "int64",
            "Outward Code_L23": "int64",
            "Outward Code_L24": "int64",
            "Outward Code_L25": "int64",
            "Outward Code_L26": "int64",
            "Outward Code_L28": "int64",
            "Outward Code_L3": "int64",
            "Outward Code_L31": "int64",
            "Outward Code_L32": "int64",
            "Outward Code_L33": "int64",
            "Outward Code_L34": "int64",
            "Outward Code_L35": "int64",
            "Outward Code_L36": "int64",
            "Outward Code_L37": "int64",
            "Outward Code_L39": "int64",
            "Outward Code_L4": "int64",
            "Outward Code_L40": "int64",
            "Outward Code_L5": "int64",
            "Outward Code_L6": "int64",
            "Outward Code_L7": "int64",
            "Outward Code_L8": "int64",
            "Outward Code_L9": "int64",
            "Outward Code_LA8": "int64",
            "Outward Code_M21": "int64",
            "Outward Code_PR8": "int64",
            "Outward Code_PR9": "int64",
            "Outward Code_SO14": "int64",
            "Outward Code_WA10": "int64",
            "Outward Code_WA7": "int64",
            "Outward Code_WA8": "int64",
            "Outward Code_WA9": "int64",
        }
    )

    # create new columns
    df["CA5"] = df["Outward Code_CA5"] * df["Count_sum"]
    df["CH2"] = df["Outward Code_CH2"] * df["Count_sum"]
    df["CH41"] = df["Outward Code_CH41"] * df["Count_sum"]
    df["CH42"] = df["Outward Code_CH42"] * df["Count_sum"]
    df["CH43"] = df["Outward Code_CH43"] * df["Count_sum"]
    df["CH45"] = df["Outward Code_CH45"] * df["Count_sum"]
    df["CH46"] = df["Outward Code_CH46"] * df["Count_sum"]
    df["CH47"] = df["Outward Code_CH47"] * df["Count_sum"]
    df["CH49"] = df["Outward Code_CH49"] * df["Count_sum"]
    df["CH60"] = df["Outward Code_CH60"] * df["Count_sum"]
    df["CH61"] = df["Outward Code_CH61"] * df["Count_sum"]
    df["CH62"] = df["Outward Code_CH62"] * df["Count_sum"]
    df["CH63"] = df["Outward Code_CH63"] * df["Count_sum"]
    df["L1"] = df["Outward Code_L1"] * df["Count_sum"]
    df["L11"] = df["Outward Code_L11"] * df["Count_sum"]
    df["L12"] = df["Outward Code_L12"] * df["Count_sum"]
    df["L13"] = df["Outward Code_L13"] * df["Count_sum"]
    df["L14"] = df["Outward Code_L14"] * df["Count_sum"]
    df["L15"] = df["Outward Code_L15"] * df["Count_sum"]
    df["L16"] = df["Outward Code_L16"] * df["Count_sum"]
    df["L17"] = df["Outward Code_L17"] * df["Count_sum"]
    df["L18"] = df["Outward Code_L18"] * df["Count_sum"]
    df["L19"] = df["Outward Code_L19"] * df["Count_sum"]
    df["L2"] = df["Outward Code_L2"] * df["Count_sum"]
    df["L20"] = df["Outward Code_L20"] * df["Count_sum"]
    df["L21"] = df["Outward Code_L21"] * df["Count_sum"]
    df["L22"] = df["Outward Code_L22"] * df["Count_sum"]
    df["L23"] = df["Outward Code_L23"] * df["Count_sum"]
    df["L24"] = df["Outward Code_L24"] * df["Count_sum"]
    df["L25"] = df["Outward Code_L25"] * df["Count_sum"]
    df["L26"] = df["Outward Code_L26"] * df["Count_sum"]
    df["L28"] = df["Outward Code_L28"] * df["Count_sum"]
    df["L3"] = df["Outward Code_L3"] * df["Count_sum"]
    df["L31"] = df["Outward Code_L31"] * df["Count_sum"]
    df["L32"] = df["Outward Code_L32"] * df["Count_sum"]
    df["L33"] = df["Outward Code_L33"] * df["Count_sum"]
    df["L34"] = df["Outward Code_L34"] * df["Count_sum"]
    df["L35"] = df["Outward Code_L35"] * df["Count_sum"]
    df["L36"] = df["Outward Code_L36"] * df["Count_sum"]
    df["L37"] = df["Outward Code_L37"] * df["Count_sum"]
    df["L39"] = df["Outward Code_L39"] * df["Count_sum"]
    df["L4"] = df["Outward Code_L4"] * df["Count_sum"]
    df["L40"] = df["Outward Code_L40"] * df["Count_sum"]
    df["L5"] = df["Outward Code_L5"] * df["Count_sum"]
    df["L6"] = df["Outward Code_L6"] * df["Count_sum"]
    df["L7"] = df["Outward Code_L7"] * df["Count_sum"]
    df["L8"] = df["Outward Code_L8"] * df["Count_sum"]
    df["L9"] = df["Outward Code_L9"] * df["Count_sum"]
    df["LA8"] = df["Outward Code_LA8"] * df["Count_sum"]
    df["M21"] = df["Outward Code_M21"] * df["Count_sum"]
    df["PR8"] = df["Outward Code_PR8"] * df["Count_sum"]
    df["PR9"] = df["Outward Code_PR9"] * df["Count_sum"]
    df["SO14"] = df["Outward Code_SO14"] * df["Count_sum"]
    df["WA10"] = df["Outward Code_WA10"] * df["Count_sum"]
    df["WA7"] = df["Outward Code_WA7"] * df["Count_sum"]
    df["WA8"] = df["Outward Code_WA8"] * df["Count_sum"]
    df["WA9"] = df["Outward Code_WA9"] * df["Count_sum"]

    df = (
        df.groupby(["start_date_time"])
        .agg(
            StartDate_first=("Start Date", "first"),
            EndDate_first=("End Date", "first"),
            CA5_sum=("CA5", "sum"),
            CH2_sum=("CH2", "sum"),
            CH41_sum=("CH41", "sum"),
            CH42_sum=("CH42", "sum"),
            CH43_sum=("CH43", "sum"),
            CH45_sum=("CH45", "sum"),
            CH46_sum=("CH46", "sum"),
            CH47_sum=("CH47", "sum"),
            CH49_sum=("CH49", "sum"),
            CH60_sum=("CH60", "sum"),
            CH61_sum=("CH61", "sum"),
            CH62_sum=("CH62", "sum"),
            CH63_sum=("CH63", "sum"),
            L1_sum=("L1", "sum"),
            L11_sum=("L11", "sum"),
            L12_sum=("L12", "sum"),
            L13_sum=("L13", "sum"),
            L14_sum=("L14", "sum"),
            L15_sum=("L15", "sum"),
            L16_sum=("L16", "sum"),
            L17_sum=("L17", "sum"),
            L18_sum=("L18", "sum"),
            L19_sum=("L19", "sum"),
            L2_sum=("L2", "sum"),
            L20_sum=("L20", "sum"),
            L21_sum=("L21", "sum"),
            L22_sum=("L22", "sum"),
            L23_sum=("L23", "sum"),
            L24_sum=("L24", "sum"),
            L25_sum=("L25", "sum"),
            L26_sum=("L26", "sum"),
            L28_sum=("L28", "sum"),
            L3_sum=("L3", "sum"),
            L31_sum=("L31", "sum"),
            L32_sum=("L32", "sum"),
            L33_sum=("L33", "sum"),
            L34_sum=("L34", "sum"),
            L35_sum=("L35", "sum"),
            L36_sum=("L36", "sum"),
            L37_sum=("L37", "sum"),
            L39_sum=("L39", "sum"),
            L4_sum=("L4", "sum"),
            L40_sum=("L40", "sum"),
            L5_sum=("L5", "sum"),
            L6_sum=("L6", "sum"),
            L7_sum=("L7", "sum"),
            L8_sum=("L8", "sum"),
            L9_sum=("L9", "sum"),
            LA8_sum=("LA8", "sum"),
            M21_sum=("M21", "sum"),
            PR8_sum=("PR8", "sum"),
            PR9_sum=("PR9", "sum"),
            SO14_sum=("SO14", "sum"),
            WA10_sum=("WA10", "sum"),
            WA7_sum=("WA7", "sum"),
            WA8_sum=("WA8", "sum"),
            WA9_sum=("WA9", "sum"),
            Count=("Count_sum", "sum"),
        )
        .reset_index()
    )

    return df


# Loaded variable 'df' from URI: /home/damien/projects/ltl-usage-graph/data/collection.csv
df = pd.read_csv(r"data/zip/collection.csv", engine="pyarrow")

df_clean = clean_data(df.copy())
df_clean.to_csv(r"src/data/postcode.csv", index=False)
