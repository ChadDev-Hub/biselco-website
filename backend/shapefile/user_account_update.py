import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text 
from pprint import pprint
from hashlib import sha256
load_dotenv(dotenv_path="../.env.dev", override=True)

NEW_DB_URL = os.getenv("BISELCOWEBSITE")

new_db = create_engine(NEW_DB_URL)


def update_consumer():
    stmt = text(
        """select * from public.users_account
            where hash is null;
        """
    )
    
    with new_db.connect() as conn:
        data =  conn.execute(stmt).mappings().all()
        data = [{
            "id" : row['id'],
            "hash" : sha256(f"{row['user_name']}|google".encode("utf-8")).hexdigest(),
        } for row in data]

        stmt = text(
            """update public.users_account
            set hash = :hash
            where id = :id;
            """
        )
        with new_db.connect() as conn:
            conn.execute(stmt, data)
            conn.commit()
    



if __name__ == "__main__":
    try: 
        pprint(update_consumer())
        print("sucessfully updated consumer")
    except Exception as e:
        print(e)