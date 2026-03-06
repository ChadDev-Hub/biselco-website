"""create trigger for substation

Revision ID: 3ec811e2f295
Revises: fcb341c0761c
Create Date: 2026-03-03 23:47:08.736476

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3ec811e2f295'
down_revision: Union[str, Sequence[str], None] = 'fcb341c0761c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
                CREATE OR REPLACE FUNCTION gis.substation_trigger_func()
                RETURNS TRIGGER AS $$
                DECLARE
                    village integer;
                    municipal integer;
                BEGIN
                    SELECT  b.village_id, b.municipality_id
                    INTO village, municipal
                    FROM gis.boundary b
                    WHERE st_intersects(b.geom, new.geom)
                    LIMIT 1;
                    new.village_id = village;
                    new.municipal_id = municipal;
                    return new;
                END;
                $$ LANGUAGE plpgsql;
               """)
    
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.substation_trigger_after_func()
               RETURNS TRIGGER AS $$
               BEGIN
                    -- UPDATE GIS FEEDER
                    UPDATE gis.feeder as f
                    SET is_active = new.is_active
                    WHERE f.substation_id = new.substation_id;
                    
                    
                    -- UPDATE GIS BUS
                    UPDATE gis.bus as b
                    set is_active = new.is_active
                    WHERE b.substation_id = new.substation_id;
                    return new;
               END;
               $$ LANGUAGE plpgsql;
                """)
    
    op.execute("""
               CREATE TRIGGER substation_trigger_after
               AFTER INSERT OR UPDATE
               ON gis.substation
               FOR EACH ROW EXECUTE FUNCTION gis.substation_trigger_after_func();
               """)
    
    op.execute("""
                CREATE TRIGGER substation_trigger
                BEFORE INSERT OR UPDATE
                ON gis.substation
                FOR EACH ROW EXECUTE FUNCTION gis.substation_trigger_func();""")
    
def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS substation_trigger ON gis.substation;")
    op.execute("DROP FUNCTION IF EXISTS gis.substation_trigger_func();")
    op.execute("DROP TRIGGER IF EXISTS substation_trigger_after ON gis.substation;")
    op.execute("DROP FUNCTION IF EXISTS gis.substation_trigger_after_func();")