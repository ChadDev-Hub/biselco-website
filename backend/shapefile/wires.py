import pandas as pd
from pprint import pprint
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy import text
import os

load_dotenv(dotenv_path=".env")


def clean_conductor_wire():
    df = pd.read_excel(r"C:\Users\RICHARD ROJO\OneDrive\Desktop\2026 DSAS\Lookup_Tables.xls", engine="calamine", sheet_name="Conductor")
    df.dropna(subset=["Type"], inplace=True)
    df.rename(columns={
        "Unnamed: 9": "Remarks"
    }, inplace=True)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df.columns = df.columns.str.replace(r"\(|\)", "", regex=True)
    df.columns = df.columns.str.replace(r"\/", "_", regex=True)
    df.rename(columns={
        "ampacity_a": "ampacity",
        "diameter_in": "diameter_inch"
    }, inplace=True)
    df.columns  = df.columns.str.replace(r'mile', "miles", regex=True)
    return df.to_dict(orient="records")

df = clean_conductor_wire()

def clean_concentric_neutral_wire():
    df = pd.read_excel(r"C:\Users\RICHARD ROJO\OneDrive\Desktop\2026 DSAS\Lookup_Tables.xls", engine="calamine", sheet_name="Concentric-Neutral Cable")
    df.dropna(subset=["Type"], inplace=True)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    df.columns = df.columns.str.replace(r"\(|\)", "", regex=True)
    df.columns = df.columns.str.replace(r"\/|-", "_", regex=True)
    df['strand'] = df['strand'].astype("int64")
    df.rename(columns={
        'diameter_over_insulation_in': 'diameter_over_insulation_inch',
        'diameter_over_screen_in': 'diameter_over_screen_inch',
        'outside_diameter_in': 'outside_diameter_inc',
        'no._of_copper_neutral': 'no_copper_neutral',
        'size_of_copper_neutral_awg' : 'size_copper_neutral',
        'ampacity_a': 'ampacity',
    }, inplace=True)
    return df.to_dict(orient="records")
n_df = clean_concentric_neutral_wire()

DB_URL = os.getenv("WEBSITE_DATABASE_URL")

def migrat(
    database_table: str,
    data: dict
    
    ):
    data_column = data[0].keys()
    columns = ", ".join(data_column)
    values = ", ".join([f":{key}" for key in data_column])
  
    insrt_tmt = text(
        f"""
        INSERT INTO {database_table} ({columns})
        values ({values});
        """
    )
    engine = create_engine(DB_URL)
    with engine.begin() as conn:
        conn.execute(insrt_tmt, data)
    

if __name__ == "__main__":
    migrat("gis.conductor_wires", clean_conductor_wire());
    migrat("gis.neutral_concentric_cable", clean_concentric_neutral_wire());
    print("migration complete")
