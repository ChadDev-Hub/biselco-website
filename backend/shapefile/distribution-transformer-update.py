from sqlalchemy import text, create_engine
from dotenv import load_dotenv
import os
import pandas as pd
from pprint import pprint
path = ".env.dev"
load_dotenv(dotenv_path=path, override=True)
DB_URL = os.getenv("BISELCO")
NEW_DB_URL = os.getenv("BISELCOWEBSITE")
old_db = create_engine(DB_URL)
new_db = create_engine(NEW_DB_URL)


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
                    where transformer_type is not null;
                """)
    df = pd.read_sql(stmt, old_db)
    df['kva rating'] = df['transformer_type'].str.split(" ").str[-1]
    df['name'] = df['phase'] + " " + df['kva rating'] + " " + "/"  + " " + df['primary_voltage_rating_kv'].astype(str)+"Kv" + " " + df['secondary_voltage_rating_kv'].astype(str)+"Kv"
    df.drop(columns=["transformer_type"])
    return df  
    

transformer_specs = old_distribution_transformer_type()
pprint(transformer_specs)
