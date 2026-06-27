import pandas as pd


def get_first_time_users_per_week(df):

    # Only keep users' first appearance
    df = (
        df.groupby(["User"])
        .agg(
            Start_Date_first=("Start_Date", "first"),
            End_Date_first=("End_Date", "first"),
        )
        .reset_index()
    )
    # Get total number of users of date range
    df = (
        df.groupby(["Start_Date_first", "End_Date_first"])
        .agg(New_Users=("User", "count"))
        .reset_index()
    )
    df = df.rename(
        columns={
            "Start_Date_first": "Start_Date",
            "End_Date_first": "End_Date",
        }
    )
    return df


def get_total_users_per_week(df):
    # // "Value","Count","Amount","Filename"
    df = (
        df.groupby(["Start_Date", "End_Date"])
        .agg(all_users=("User", "count"))
        .reset_index()
    )
    return df

def split_filename_date(df):
    df["Filename"] = df["Filename"].str.replace(
        "data/zip/|\\.csv", "", case=False, regex=True
    )
    # Split text using string '-to-' in column: 'Filename'
    loc_0 = df.columns.get_loc("Filename")
    df_split = df["Filename"].str.split(pat="-to-", expand=True).add_prefix("Filename_")
    df = pd.concat([df.iloc[:, :loc_0], df_split, df.iloc[:, loc_0:]], axis=1)
    df = df.drop(columns=["Filename"])
    # Rename column 'Filename_0' to 'Start_Date'
    df = df.rename(columns={"Filename_0": "Start_Date"})
    # Rename column 'Filename_1' to 'End_Date'
    df = df.rename(columns={"Filename_1": "End_Date"})
    # Replace all instances of "(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)" with "\\3/\\2/\\1" in columns: 'End_Date', 'Start_Date'
    df["End_Date"] = df["End_Date"].str.replace(
        "(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)", "\\3/\\2/\\1", case=False, regex=True
    )
    df["Start_Date"] = df["Start_Date"].str.replace(
        "(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)", "\\3/\\2/\\1", case=False, regex=True
    )
    return df



def get_dates_from_filename(df):
    # Replace all instances of "data/user/|\\.csv" with "" in column: 'Filename'
    df["Filename"] = df["Filename"].str.replace(
        "data/user/|\\.csv", "", case=False, regex=True
    )
    # Split text using string '_to_' in column: 'Filename'
    loc_0 = df.columns.get_loc("Filename")
    df_split = df["Filename"].str.split(pat="-to-", expand=True).add_prefix("Filename_")
    df = pd.concat([df.iloc[:, :loc_0], df_split, df.iloc[:, loc_0:]], axis=1)
    df = df.drop(columns=["Filename"])
    # Rename columns 'Filename_0' to 'Start_Date'
    df = df.rename(columns={"Filename_0": "Start_Date", "Filename_1": "End_Date"})
    print(df.head())
    return df


def prepare_data(df):
    df = df.drop(columns=["Count", "Amount"])

    df = df.rename(columns={"Value": "User"})
    return df


def clean_data(df):
    df = df.rename(columns={"End_Date_y": "End_Date"})
    df = df.drop(columns=["End_Date_x"])
    df["New_Users"] = df["New_Users"].fillna(0).astype(int)
    return df

# Fran Murphy (murphyfa)
# First_Name Last_Name (username)
def keep_only_username(df):
    df["User"] = df["User"].str.split("(").str[-1].str.strip(")")
    print(df.head())
    return df


df = pd.read_csv(r"data/user/collection.csv", engine="pyarrow")
df = get_dates_from_filename(df)
df = prepare_data(df)
df = keep_only_username(df)

df_total_users = get_total_users_per_week(df.copy())
df_first_time_users = get_first_time_users_per_week(df.copy())

df = pd.merge(df_first_time_users, df_total_users, how="outer", on="Start_Date")
df = clean_data(df)

df.to_csv(r"src/data/first.csv", index=False)