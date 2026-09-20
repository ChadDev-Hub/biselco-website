from sqlalchemy import text, create_engine
from dotenv import load_dotenv
import os
import pandas as pd
from pprint import pprint
from pydantic import BaseModel
path = ".env"
load_dotenv(dotenv_path=path, override=True)
DB_URL = os.getenv("BISELCO")
NEW_DB_URL = os.getenv("BISELCOWEBSITE")
old_db = create_engine(DB_URL)
new_db = create_engine(NEW_DB_URL)

from typing import List


class TransformerType(BaseModel):
    phase: str
    kva_rating: str
    primary_voltage_rating: float
    secondary_voltage_rating: float
    

def old_distribution_transformer_type():
    stmt = text("""
                select
                    distinct
                    case when
                    length(primary_phasing::text) = 4
                    then '3P' else '1P' end as phase,
                    transformer_type,
                    primary_voltage_rating_kv,
                    secondary_voltage_rating_kv
                    from 
                    gis.distribution_transformer
                    where transformer_type is not null
                """)
    df = pd.read_sql(stmt, old_db)
    df['kva_rating'] = df['transformer_type'].str.split(" ").str[-1]
    df['name'] = df['phase'] + " " + df['kva_rating'] + " " + "/"  + " " + df['primary_voltage_rating_kv'].astype(str)+"Kv" + " " + df['secondary_voltage_rating_kv'].astype(str)+"Kv"
    df.drop(columns=["transformer_type"])
    df.rename(columns={
        "primary_voltage_rating_kv": "primary_voltage_rating",
        "secondary_voltage_rating_kv": "secondary_voltage_rating"
    }, inplace=True)
    df = df[['kva_rating', 'phase', 'primary_voltage_rating','secondary_voltage_rating']]
    df = df.to_dict(orient="records")
    return [TransformerType(**i) for i in df]
    
def old_distribution_transformer() -> pd.DataFrame: 
    stmt = text("""
                select 
                transformer_id,
                case when
                    length(primary_phasing::text) = 4
                    then '3P' else '1P' end as phase,
                    transformer_type,
                    primary_voltage_rating_kv,
                    secondary_voltage_rating_kv
                from gis.distribution_transformer
                """)
    df = pd.read_sql(stmt, old_db)
    df['kva rating'] = df['transformer_type'].str.split(" ").str[-1]
    df['primary_voltage_rating_kv'] = df['primary_voltage_rating_kv'].astype(float).map(lambda x: f"{x:.2f}")
    df['secondary_voltage_rating_kv'] = df['secondary_voltage_rating_kv'].astype(float).map(lambda x: f"{x:.2f}")
    df['name'] = df['phase'] + " " + df['kva rating'] + " " + "/"  + " " + df['primary_voltage_rating_kv'].astype(str)+"Kv" + " " + df['secondary_voltage_rating_kv'].astype(str)+"Kv"
    df = df[['transformer_id', 'name']]
   
    df.dropna(subset=['name'], inplace=True)
    return df.to_dict(orient="records")


def new_transformer_type():
    stmt = text("""
                SELECT id, name FROM gis.transformer_type;
                """)
    with new_db.connect() as conn:
        return conn.execute(stmt).mappings().all()
    
def update_new_transformer_type():
    old_df = old_distribution_transformer()
    new_df = new_transformer_type()
   
    # CREATE NEW PARAMETER DATA FOR UPDATING TRANSFORMER TYPE IN DISTRIBUTION TRANSFORMER
    new_data = [
        {
            "transformer_id": j['transformer_id'],
            "transformer_type": i["id"]} for i in new_df  for j  in old_df
            if i['name'] == j['name']
    ]
   
    # pprint([ i['transformer_type'] for i in new_data])
    stmt = text("""
                UPDATE gis.distribution_transformer
                SET transformer_type = :transformer_type
                WHERE transformer_id = :transformer_id;
                """)
    with new_db.begin() as conn:
        conn.execute(stmt, new_data)
    return "success"
    
        

def insert_trasnformer_type(data:List[TransformerType]):
    stmt = text("""
                INSERT INTO gis.transformer_type (phase, kva_rating, primary_voltage_rating, secondary_voltage_rating)
                VALUES (:phase, :kva_rating, :primary_voltage_rating, :secondary_voltage_rating);
                """)
    list_data  = [i.model_dump(mode="python") for i in data]
   
    with new_db.begin() as conn:
        conn.execute(stmt, list_data)
    return "success"
    

if __name__ == "__main__":
    old_transformer_type = old_distribution_transformer_type()
    insert = insert_trasnformer_type(old_transformer_type)
    update = update_new_transformer_type()
    print("sucessfully updated transformer type")
   