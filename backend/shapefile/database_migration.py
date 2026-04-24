from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import geopandas as gpd
import os
from dotenv import load_dotenv
from geoalchemy2.elements import WKBElement, WKTElement
load_dotenv()


# DATABASE ENGINE
EXISTING_GIS_DATABASE = None
existing_database_url = os.getenv("BISELCO")
if existing_database_url:
    EXISTING_GIS_DATABASE= create_engine(existing_database_url)

current_database_url = os.getenv("BISELCOWEBSITE")

Session = None
if current_database_url:
    CURRENT_GIS_DATABASE= create_engine(current_database_url)
    Session = sessionmaker(CURRENT_GIS_DATABASE)
    
    

# --------------------------------------FRANCHISE AREA ---------------------------------
# MUNICIPALITY
values_mun = None
if not EXISTING_GIS_DATABASE:
    raise Exception("Database connection is not established")
if not Session:
    raise Exception("Database connection is not established")


municipality = gpd.pd.read_sql(
    sql="""SELECT distinct municipality FROM gis.franchise_area order by municipality;""",
    con=EXISTING_GIS_DATABASE
)
values_mun = [(m,) for m in municipality['municipality'].to_list()]


if values_mun:
    # DATA MIGRATION FOR MUNICIPALITY VALUES
    with Session.begin() as session:
        session.execute(statement=text(
            
            """INSERT INTO gis.municipality (name)
            VALUES (:mun)"""),
            params= [{"mun": m[0]} for m in values_mun] 
        )
        session.commit()
print("sucessfully inserted municipality")
    
# VILLAGE DATA MIGRATION, NORMALIZTION AND PROCESSING
village = gpd.pd.read_sql(
    sql = """SELECT distinct village, municipality FROM gis.franchise_area order by village;""",
    con=EXISTING_GIS_DATABASE
)

insert_stmt = text(
    """INSERT INTO gis.villages (municipality_id, name)
    VALUES (
        (SELECT id FROM gis.municipality WHERE name = :mun), :vill)"""
)
params = [{"mun": v[1], "vill": v[0]} for v in village.values]


with Session.begin() as session:
    session.execute(
        insert_stmt,
        params
    )
    session.commit()
print("sucessfully inserted village")




boundary = gpd.read_postgis(
    sql = """SELECT distinct geom, municipality, village FROM gis.franchise_area;""",
    con=EXISTING_GIS_DATABASE,
    geom_col="geom"
)

params = [{"geom": b[0].wkt, "mun": b[1], "vill": b[2], "name": f"{b[2]} {b[1]}"} for b in boundary.values]

stmt = text(
    """INSERT INTO gis.boundary (geom, municipality_id, village_id, name)
    VALUES (:geom, (SELECT id FROM gis.municipality WHERE name = :mun), (SELECT id FROM gis.villages WHERE name = :vill and municipality_id = (SELECT id FROM gis.municipality WHERE name = :mun)), :name);
    """
)

with Session.begin() as session:
    session.execute(stmt, params)
    session.commit()
print("sucessfully inserted boundary")



# ----------------------------------------------DISTRIBUTION UTILITIES-------------------------------------------------
# SUBSTAION

substation = gpd.read_postgis(
    sql="""select * from gis.power_station;""",
    con=EXISTING_GIS_DATABASE,
    geom_col="geom"
)
params = [{
    "geom": s[1].wkt,
    "substation_id": s[2],
    "phasing": s[4],
    "description": s[5],
    "vr": s[7],
    "vp": s[9],
    "active": True,
    "image": s[13]
} for s in substation.values]

stmt = text("""
            INSERT INTO gis.substation (geom, substation_id, phasing, description,voltage_rating_kv, voltage_profile_id, is_active, image)
            values(:geom, :substation_id, :phasing, :description, :vr, :vp, :active, :image);
            """)

with Session.begin() as session:
    session.execute(stmt, params)
    session.commit()
print("sucessfully inserted substation")





# BUS OR NODE
bus = gpd.read_postgis(
    sql="select * from gis.bus",
    con=EXISTING_GIS_DATABASE,
    geom_col="geom"
)
params = [{
    "geom": b[1].wkt,
    "bus_id": b[2],
    "description": b[4],
    "nmv": b[5],
    "image": b[11],
    "is_active": True,

} for b in bus.values]


stmt = text("""
            INSERT INTO gis.bus (geom, bus_id, description, nominal_voltage_kv, image, is_active)
            values(:geom, :bus_id, :description, :nmv, :image, :is_active)
            ON CONFLICT (bus_id) DO UPDATE SET geom=EXCLUDED.geom, description=EXCLUDED.description, nominal_voltage_kv=EXCLUDED.nominal_voltage_kv, image=EXCLUDED.image, is_active=EXCLUDED.is_active;
            """)

with Session.begin() as session:
    session.execute(stmt, params)
    session.commit()
print("sucessfully inserted bus")



# FEEDER 
params = {
    "feed": "%f%"
}

feeder = gpd.read_postgis(
    sql="""select * From gis.bus
    where description = 'Primary Node'
    and bus_id in ('F1','F2','F3','F4')
    """,
    con=EXISTING_GIS_DATABASE,
    geom_col="geom",
)

for f in feeder.values:
    params = {
        "geom": f[1].wkt,
        "subs_id": 'CIPC0001',
        "f_id": 'FAB0001' if f[2] == 'F1'
        else 'FAB0003' if f[2] == 'F3' else 'FAB0004' if f[2] == 'F4' else 'FAB0002',
        "description": 'Tagumpay Feeder' if f[2] == 'F1'
        else 'KM7 Feeder' if f[2] == 'F3' else 'Busuanga Feeder' if f[2] == 'F4' else 'Coron Feeder',
        "is_active": True
    }   
    stmt = text("""
            INSERT INTO gis.feeder (geom, substation_id, feeder_id, description, is_active)
            values(:geom, :subs_id, :f_id, :description, :is_active)
            ON CONFLICT (feeder_id) DO UPDATE SET geom=EXCLUDED.geom, substation_id=EXCLUDED.substation_id, description=EXCLUDED.description, is_active=EXCLUDED.is_active  ;
            """)
    with Session.begin() as session:
        session.execute(stmt, params)
        session.commit()
    print("sucessfully inserted feeder")
    
    
# Primary Lines
pl = gpd.read_postgis(
    sql="""WITH RECURSIVE feeder_tree AS (

    -- Root lines (connected to power station)
    SELECT 
        pl.geom,
        pl.primary_line_id,
        pl.phasing,
		pl.from_bus_id,
		pl.to_bus_id,
        pl.description,
        pl.configuration,
        pl.system_grounding_type,
        
        1 as level
    FROM gis.primary_line pl
    JOIN gis.power_station p
    ON ST_Intersects(ST_StartPoint(pl.geom), p.geom)

    UNION ALL

    -- Next connected lines
    SELECT
        pl2.geom,
        pl2.primary_line_id,
        pl2.phasing,
		pl2.from_bus_id,
		pl2.to_bus_id,
        pl2.description,
        pl2.configuration,
        pl2.system_grounding_type,
        
        ft.level + 1
    FROM feeder_tree ft
    JOIN gis.primary_line pl2
    ON ft.to_bus_id = pl2.from_bus_id
), primary_lines_ordered as (
SELECT distinct on (primary_line_id) geom ,primary_line_id,phasing, from_bus_id, to_bus_id,   description, configuration, system_grounding_type, level
FROM feeder_tree
ORDER BY  primary_line_id, level)
select * from primary_lines_ordered
order by level;""",
    con=EXISTING_GIS_DATABASE,
    geom_col="geom",
)


stmt = text(
    """
            INSERT INTO gis.primary_lines 
            (geom, primary_line_id, phasing, description, configuration, system_ground_type, is_active)
            values(:geom, :pl_id, :phasing, :desc, :config, :ground_type, :is_active)
            ON CONFLICT (primary_line_id)
            DO UPDATE
            SET geom=EXCLUDED.geom, phasing=EXCLUDED.phasing, description=EXCLUDED.description, configuration=EXCLUDED.configuration, system_ground_type=EXCLUDED.system_ground_type, is_active=EXCLUDED.is_active;
            """
)
session = Session()

for p in pl.values:
    params = {
        "geom": p[0].wkt,
        "pl_id": p[1],
        "phasing": p[2],
        "desc": p[5],
        "config": p[6],
        "ground_type": p[7],
        "is_active": True,
    }
    try:
        session.execute(stmt, params)
        session.commit()
        print("sucessfully inserted primary lines", p[1])
    except Exception as e:
        session.rollback()
        print(f"❌ Failed on {p[1]}")
        print(e)
        break

#  Distribution Transformer

dt = gpd.read_postgis(
    sql="""select * from gis.distribution_transformer;""",
    con=EXISTING_GIS_DATABASE,
    geom_col="geom",
)
session = Session()
stmt = text("""
            INSERT INTO gis.distribution_transformer 
            (geom, transformer_id, primary_phasing, secondary_phasing, description, installation_type, connection_code, remarks, image, is_active)
            values(:geom, :dt_id, :pp, :sp, :desc, :installation_type, :c_code,:remarks, :image, :is_active)
            ON CONFLICT (transformer_id)
            DO UPDATE
            SET 
            primary_phasing = excluded.primary_phasing,
            secondary_phasing = excluded.secondary_phasing,
            description = excluded.description,
            installation_type = excluded.installation_type,
            connection_code = excluded.connection_code,
            remarks = excluded.remarks,
            image = excluded.image,
            is_active = excluded.is_active;
            """)
for t in dt.values:
    params = {
        "geom" : t[1].wkt,
        "dt_id": t[2],
        "pp" : t[5],
        "sp": t[6],
        "desc": str(t[7]).title(),
        "installation_type": t[8],
        "c_code": t[9],
        "remarks": t[18],
        "image": t[19],
        "is_active": True
    }
    try:
        session.execute(statement=stmt, params=params)
        session.commit()
        print("sucessfully inserted", t[2], "transformer")
    except Exception as e:
        print(f"❌ Failed on {t[2]}")
        print(e)
        
        
# LINE BUSHING
linebushing = gpd.read_postgis(
    sql="""select * from gis.line_bushing;""",
    con=EXISTING_GIS_DATABASE,
    geom_col="geom",
)

session = Session()
stmt = text("""
            INSERT INTO gis.transformer_linebushing (geom, is_active)
            VALUES (:geom, :is_active);
            """)
for b in linebushing.values:
    params = {
        "geom" : b[1].wkt,
        "is_active": True
    }
    try:
        session.execute(stmt, params)
        session.commit()
        print("sucessfully inserted linebushing")
    except Exception as e:
        print(f"❌ Failed on linebushing", f"{b[0]}")
        print(e)
        break



# SECONDARY LINE


sl = gpd.read_postgis(
    sql="""
    With RECURSIVE sl_tree as (
            select sl.geom, sl.secondary_line_id, sl.from_bus_id, sl.to_bus_id, sl.description,  1 as rn 
            FROM gis.secondary_line as sl
            join gis.distribution_transformer as dt 
            on dt.to_secondary_bus_id = sl.from_bus_id 

            UNION ALL

            select sl2.geom, sl2.secondary_line_id, sl2.from_bus_id, sl2.to_bus_id, sl2.description,  st.rn+1
            from sl_tree as st
            join gis.secondary_line as sl2
            on st.to_bus_id = sl2.from_bus_id
            ),
            secondary_lines as (
            select distinct on (secondary_line_id) * From sl_tree)
            select * from secondary_lines
            order by rn;
    """,
    con=EXISTING_GIS_DATABASE,
    geom_col="geom",
)

stmt = text("""
            INSERT INTO gis.secondary_lines
            (geom, description , is_active)
            values(:geom, :description, :is_active);
            """)
for i, s in sl.iterrows():
    geom = s['geom'].wkt
    description = s['description']
    is_active = True
    params = {
        "geom" : geom,
        "description": description,
        "is_active": is_active
    }
    try:
        session.execute(stmt, params)
        session.commit()
        print("sucessfully inserted secondary lines")
    except Exception as e:
        print(f"❌ Failed on secondary lines", f"{s['secondary_line_id']}")
        print(e)
        break
    


# CONSUMERS
consumers = gpd.read_postgis(
    sql="""select * From gis.customer;""",
    con=EXISTING_GIS_DATABASE,
    geom_col="geom"
)
params = [
    {
        "geom": c['geom'].wkt,
        "account_num": c["customer_id"],
        "account_name": c["customer_name"],
        "account_type": c['customer_type'],
        "description": c['description'],
        "meter_no": c['meter_number'],
        "meter_brand": c['brand'],
        "date_installed": gpd.pd.to_datetime(c['time'], errors="coerce") if gpd.pd.notna(gpd.pd.to_datetime(c['time'], errors="coerce")) else None,
        "remarks": c['remarks'],
        "image": c['image'],
        "is_active": True

    }
    for _, c in consumers.iterrows()
]
session = Session()
stmt = text("""
            INSERT INTO gis.consumer_meter(
            geom, account_no, account_name, account_type, description, meter_no, meter_brand, date_installed, remarks, image, is_active)
            values (:geom, :account_num, :account_name, :account_type, :description, :meter_no, :meter_brand, :date_installed, :remarks, :image, :is_active);
            """)

try:
    session.execute(stmt, params)
    session.commit()
    print("sucessfully inserted consumers")
except Exception as e:
    print(f"❌ Failed on consumers")
    print(e)
    
    



# SERVICE DROP

sd = gpd.read_postgis(
    sql= '''SELECT * FROM gis.customer_service_drop;''',
    con=EXISTING_GIS_DATABASE,
    geom_col="geom"
)
stmt = text("""
            INSERT INTO gis.service_drop (geom, description, is_active)
            VALUES (:geom,:description, :is_active);
            """)
session = Session()
for _,s in sd.iterrows():
    params = {
        "geom": s['geom'].wkt,
        "description": s['description'],
        "is_active": True
    }
    try:
        session.execute(stmt, params)
        session.commit()
        print("sucessfully inserted service drop")
    except Exception as e:
        print(f"❌ Failed on service drop")
        print(e)
        break
        