import pandas as pd


def clean_postcodes(df):

    # clean postcodes
    df = df.drop(columns=["Amount"])
    df = df.rename(columns={"Value": "postcode_no_space"})
    df["postcode_no_space"] = df["postcode_no_space"].str.upper()
    df["postcode_no_space"] = df["postcode_no_space"].str.replace(
        " ", "", case=False, regex=False
    )
    df = df.dropna(subset=["postcode_no_space"])

    # get clean dates
    df["Filename"] = df["Filename"].str.replace(
        "data/zip|.csv", "", case=False, regex=True
    )
    loc_0 = df.columns.get_loc("Filename")
    df_split = df["Filename"].str.split(pat="-to-", expand=True).add_prefix("Filename_")
    df = pd.concat([df.iloc[:, :loc_0], df_split, df.iloc[:, loc_0:]], axis=1)
    df = df.drop(columns=["Filename"])
    df = df.rename(columns={"Filename_0": "start_date"})
    df = df.rename(columns={"Filename_1": "end_date"})
    df = df.astype({"start_date": "datetime64[ns]"})
    df = df.astype({"end_date": "datetime64[ns]"})

    # aggregation grouped on columns
    df = (
        df.groupby(["postcode_no_space", "start_date", "end_date"])
        .agg(Count_sum=("Count", "sum"))
        .reset_index()
    )
    return df


def add_headers(df: pd.DataFrame):
    df.columns = [
        "postcode",
        "status",
        "usertype",
        "easting",
        "northing",
        "positional_quality_indicator",
        "country",
        "latitude",
        "longitude",
        "postcode_no_space",
        "postcode_fixed_width_seven",
        "postcode_fixed_width_eight",
        "postcode_area",
        "postcode_district",
        "postcode_sector",
        "outcode",
        "incode",
    ]
    return df


def drop_extra_columns(df: pd.DataFrame):
    df = df.drop(
        columns=[
            "usertype",
            "status",
            "easting",
            "northing",
            "positional_quality_indicator",
            "country",
            "postcode_fixed_width_seven",
            "postcode_fixed_width_eight",
            # "postcode_area",
            # "postcode_district",
            # "postcode_sector",
            "outcode",
            "incode",
        ]
    )
    return df


def remove_postcode_no_space(df: pd.DataFrame):
    # df = df.drop(columns=['id'])
    df = df.drop(
        columns=[
            "postcode_no_space",
        ]
    )
    df = df.sort_values(["start_date"], na_position="first")
    return df

def remove_useless_columns(df: pd.DataFrame):
    # df = df.drop(columns=['id'])
    df = df.drop(
        columns=[
            "postcode_area",
            "postcode_district",
            "postcode_sector",
        ]
    )
    df = df.sort_values(["start_date"], na_position="first")
    return df


def merge_tables(df_tools, df_codes):
    return pd.merge(df_tools, df_codes, on="postcode_no_space", how="inner")


def merge_sectors(df_sector: pd.DataFrame, df_codes: pd.DataFrame):
    print("df_codes:")
    print(df_codes.head())

    df_codes = (
        df_codes.groupby(["postcode_sector"])
        .agg(Lat=("latitude", "first"), Long=("longitude", "first"))
        .reset_index()
    )

    print("merge:")
    df_sector_clean = pd.merge(
        df_sector.copy(), df_codes, on="postcode_sector", how="left"
    )

    print(df_sector_clean.head())
    # "postcode_area",
    # "postcode_district",
    # "postcode_sector",
    # df_sector = df_sector_clean.drop(
    #     columns=[
    #         "postcode",
    #         "postcode_no_space",
    #         "postcode_area",
    #         "postcode_district",
    #         # "postcode_sector",
    #     ]
    # )
    # print(df_sector.head())
    return df_sector_clean


def aggregate_sectors(
    df: pd.DataFrame,
):
    print(df.head())
    print("aggregation:")

    df_sector = (
        df.groupby(["postcode_sector", "start_date", "end_date"])
        .agg(Count=("Count_sum", "sum"))
        .reset_index()
    )

    print(df_sector.head())

    return df_sector


def merge_districts(df_district: pd.DataFrame, df_codes: pd.DataFrame):
    df_codes = (
        df_codes.groupby(["postcode_district"])
        .agg(Lat=("latitude", "first"), Long=("longitude", "first"))
        .reset_index()
    )

    df_district_clean = pd.merge(
        df_district.copy(), df_codes, on="postcode_district", how="left"
    )

    return df_district_clean


def aggregate_districts(
    df: pd.DataFrame,
):
    df_district = (
        df.groupby(["postcode_district", "start_date", "end_date"])
        .agg(Count=("Count_sum", "sum"))
        .reset_index()
    )

    return df_district


def rename_columns_for_consistency(df: pd.DataFrame):
    # Count,Lat,Long
    # to
    # Count_sum,latitude,longitude
    df = df.rename(columns={"Count": "Count_sum"})
    df = df.rename(columns={"Lat": "latitude"})
    df = df.rename(columns={"Long": "longitude"})
    df = df.sort_values(["start_date"], na_position="first")

    return df


df_ltl = pd.read_csv(r"data/zip/collection.csv", engine="pyarrow")

df_ltl_clean = clean_postcodes(df_ltl.copy())

# Loaded variable 'df' from URI: /home/damien/projects/LTL_data/ukpostcodes.csv
df_postcode = pd.read_csv(r"postcodes.csv", engine="pyarrow")

df_postcode = add_headers(df_postcode)
df_postcode_clean = drop_extra_columns(df_postcode.copy())

print("df_ltl_clean")
print(df_ltl_clean.head())
df_merged = merge_tables(df_ltl_clean, df_postcode_clean.copy())
print("df_merged")
print(df_merged.head())

df_final = remove_postcode_no_space(df_merged.copy())


df_sector = aggregate_sectors(df_final.copy())
df_sector = merge_sectors(df_sector.copy(), df_postcode_clean.copy())
df_sector = rename_columns_for_consistency(df_sector.copy())

df_sector.to_csv(r"src/data/mapsector.csv", index=False)

df_district = aggregate_districts(df_final.copy())
df_district = merge_districts(df_district.copy(), df_postcode_clean.copy())
df_district = rename_columns_for_consistency(df_district.copy())

df_district.to_csv(r"src/data/mapdistrict.csv", index=False)

df_final = remove_useless_columns(df_merged.copy())


df_final.to_csv(r"src/data/map.csv", index=False)
