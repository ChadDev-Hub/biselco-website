from sqlalchemy import text, create_engine
from dotenv import load_dotenv
import os
from pprint import pprint
path = ".env.dev"
load_dotenv(dotenv_path=path, override=True)
DB_URL = os.getenv("BISELCO")
NEW_DB_URL = os.getenv("BISELCOWEBSITE")
old_db = create_engine(DB_URL)
new_db = create_engine(NEW_DB_URL)



def old_distribution_transformer_type():
    stmt = text("""
                select distinct transformer_type from gis.distribution_transformer; 
                """)
    with old_db.connect() as conn:
        return conn.execute(stmt).mappings().all()

print(old_distribution_transformer_type())
