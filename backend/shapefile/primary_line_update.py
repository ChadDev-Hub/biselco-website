from sqlalchemy import text, create_engine
from dotenv import load_dotenv
import os
from pprint import pprint
load_dotenv(dotenv_path=".env")
DB_URL = os.getenv("BISELCO")
NEW_DB_URL = os.getenv("BISELCOWEBSITE")
old_db = create_engine(DB_URL)
new_db = create_engine(NEW_DB_URL)


def get_primary_line_conductor():
    stmt = text("""
                select 
                primary_line_id,
                conductor_type,
                neutral_wire_type
                from gis.primary_line;
                """)
    with old_db.connect() as conn:
        return conn.execute(stmt).mappings().all()


def conductor_data():

    stmt = text("""
                select * from gis.conductor_wires;
                """)
    with new_db.connect() as conn:
        return conn.execute(stmt).mappings().all()

def neutral_data():
    stmt = text("""
                select * from gis.neutral_concentric_cable;
                """)
    with new_db.connect() as conn:
        return conn.execute(stmt).mappings().all()
    
def updated_primary_line():
    primary_line_data = get_primary_line_conductor()
    new_conductor_data = conductor_data()
    new_neutral_concentric_wire = neutral_data()
    updated_line = []
    for line in primary_line_data:
        updated = dict(line)
        for conductor in new_conductor_data:
            if line["conductor_type"] == conductor["name"]:
                updated['conductor_id']= conductor["id"]
                
        for neutral in new_neutral_concentric_wire:
            if line['neutral_wire_type'] == neutral["name"]:
                updated['neutral_id'] = neutral["id"]
        updated_line.append(updated)
    return updated_line

def update_primary_line_data():
    stmt = text("""
                UPDATE gis.primary_lines
                SET conductor_wire = :conductor_id,
                neutral_wire = :neutral_id
                WHERE primary_line_id = :primary_line_id;
                """)
    with new_db.connect() as conn:
        conn.execute(stmt, updated_primary_line())
        conn.commit()

    


if __name__ == "__main__":
    update_primary_line_data()
    print("sucessfully updated primary lines")

