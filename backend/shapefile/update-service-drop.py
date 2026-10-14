import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text 
from pprint import pprint
from hashlib import sha256
from pathlib import Path
env_path = Path(".env.dev").resolve()

load_dotenv(dotenv_path=env_path, override=True)

NEW_DB_URL = os.getenv("BISELCOWEBSITE")
BISELCO_URL = os.getenv("BISELCO")

old_db = create_engine(BISELCO_URL)
new_db = create_engine(NEW_DB_URL)



def update_service_drop():
    print(BISELCO_URL)
    stmt = text("""
                select * from gis.customer_service_drop;
                """)
    with old_db.connect() as conn:
        data = conn.execute(stmt).mappings().all()
        return [{
            "to_customer_id" : d['to_customer_id'],
            "conductor_type" : d['conductor_type'],
            }for d in data]
def get_conductor():
    stmt = text("""
                select * from gis.conductor_wires;
                """)
    with new_db.connect() as conn:
        return conn.execute(stmt).mappings().all()

def update_stmt(data: dict):
    update_stmt = text("""
                UPDATE gis.service_drop
                SET conductor_type = :conductor_type
                WHERE to_customer_id = :to_customer_id;
                """)
    with new_db.connect() as conn:
        conn.execute(update_stmt, data)
        conn.commit()
    return "success"


if __name__ == '__main__':
    sd_data = update_service_drop()
    c_data = get_conductor()
    conducto_mapping = {
        c['name'] : c['id'] for c in c_data
    }

    cleaned_data = [
        {
            "to_customer_id" : d['to_customer_id'],
            "conductor_type" : conducto_mapping.get(d['conductor_type'])
        }for d in sd_data
    ]
    
    
    # update service drop
    print(update_stmt(cleaned_data))
    