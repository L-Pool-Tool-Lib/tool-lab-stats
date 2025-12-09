import pandas as pd


def clean_data(df):
    # Clean date
    df["Filename"] = df["Filename"].str.replace(
        "data/sex/|\\.csv", "", case=False, regex=True
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
    # One-hot encode column: 'Value'
    insert_loc = df.columns.get_loc("Value")
    df = pd.concat(
        [
            df.iloc[:, :insert_loc],
            pd.get_dummies(df.loc[:, ["Value"]]),
            df.iloc[:, insert_loc + 1 :],
        ],
        axis=1,
    )

    # Replace all booleans with 0 or 1
    df = df.rename(columns={"Filename_0": "Start Date"})
    df = df.rename(columns={"Value_OTHER": "Value_other"})
    df = df.rename(columns={"Value_FEMALE": "Value_female"})
    df = df.rename(columns={"Value_MALE": "Value_male"})
    df = df.rename(columns={"Value_UNSPECIFIED": "Value_unspecified"})

    df.loc[df["Value_female"] == False, "Value_female"] = 0
    df.loc[df["Value_female"] == True, "Value_female"] = 1
    df.loc[df["Value_[None]"] == False, "Value_[None]"] = 0
    df.loc[df["Value_[None]"] == True, "Value_[None]"] = 1
    df.loc[df["Value_male"] == False, "Value_male"] = 0
    df.loc[df["Value_male"] == True, "Value_male"] = 1
    df.loc[df["Value_other"] == False, "Value_other"] = 0
    df.loc[df["Value_other"] == True, "Value_other"] = 1
    df.loc[df["Value_unspecified"] == False, "Value_unspecified"] = 0
    df.loc[df["Value_unspecified"] == True, "Value_unspecified"] = 1
    # create new columns
    df["male"] = df["Value_male"] * df["Count"]
    df["female"] = df["Value_female"] * df["Count"]
    df["none"] = df["Value_[None]"] * df["Count"]
    df["other"] = df["Value_other"] * df["Count"]
    df["unspecified"] = df["Value_unspecified"] * df["Count"]
    # Drop columns: 'Value_[None]', 'Value_female' and 3 other columns
    df = df.drop(
        columns=[
            "Value_[None]",
            "Value_female",
            "Value_male",
            "Value_other",
            "Value_unspecified",
        ]
    )
    # Drop column: 'Amount'
    df = df.drop(columns=["Amount"])
    # Clone column 'Start Date' as 'start_date_time'
    df["start_date_time"] = df.loc[:, "Start Date"]
    # Replace all instances of "(\\d\\d)/(\\d\\d)/(\\d\\d\\d\\d)" with "\\3-\\2-\\1" in column: 'start_date_time'
    df["start_date_time"] = df["start_date_time"].str.replace(
        "^(\\d\\d)/(\\d\\d)/(\\d\\d\\d\\d)$", "\\3-\\2-\\1", case=False, regex=True
    )
    # Change column type to int64 for column: 'female'
    df = df.astype({"female": "int64"})
    # Change column type to int64 for column: 'none'
    df = df.astype({"none": "int64"})
    # Change column type to int64 for column: 'male'
    df = df.astype({"male": "int64"})
    # Change column type to int64 for columns: 'other', 'unspecified'
    df = df.astype({"other": "int64", "unspecified": "int64"})
    # Performed 7 aggregations grouped on column: 'start_date_time'
    df = (
        df.groupby(["start_date_time"])
        .agg(
            StartDate_first=("Start Date", "first"),
            EndDate_first=("End Date", "first"),
            male_sum=("male", "sum"),
            female_sum=("female", "sum"),
            none_sum=("none", "sum"),
            unspecified_sum=("unspecified", "sum"),
            Count_sum=("Count", "sum"),
        )
        .reset_index()
    )
    return df


# Loaded variable 'df' from URI: /home/damien/projects/ltl-usage-graph/data/collection.csv
df = pd.read_csv(r"data/sex/collection.csv", engine="pyarrow")

df_clean = clean_data(df.copy())
df_clean.to_csv(r"src/data/gender.csv", index=False)
