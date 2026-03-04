"""trigger_for_bus

Revision ID: 054fe1c14cc2
Revises: 1308dcea3cf5
Create Date: 2026-03-04 11:50:43.821157

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '054fe1c14cc2'
down_revision: Union[str, Sequence[str], None] = '1308dcea3cf5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.bus_trigger_func()
               RETURNS TRIGGER AS $$
               DECLARE
                   substation text;
                   feeder text;
                   village integer;
                   municipal integer;
                   
               BEGIN
                   SELECT b.village_id, b.municipality_id
                   INTO village, municipal
                   FROM gis.boundary as b
                   WHERE st_intersects(b.geom, new.geom)
                   LIMIT 1;
                   
                   IF village IS NULL AND municipal IS NULL THEN 
                       RAISE EXCEPTION 'No Matching Boundary Found';
                       END IF;
                    
                   SELECT st.substation_id
                   INTO substation
                   FROM gis.substation as st
                   WHERE st_intersects(st.geom, new.geom)
                   LIMIT 1;
                   
                   IF substation IS NULL THEN
                            SELECT f.feeder_id, f.substation_id
                            INTO feeder, substation
                            FROM gis.feeder as f
                            WHERE st_intersects(f.geom, new.geom)
                            LIMIT 1;
                   END IF;
                   
                   new.substation_id = substation;
                   new.feeder_id = feeder;
                   new.village_id = village;
                   new.municipal_id = municipal;
                   RETURN new;
               END;
               $$ LANGUAGE plpgsql;
               """)
    
    op.execute("""
               CREATE TRIGGER bus_trigger
               BEFORE INSERT OR UPDATE
               ON gis.bus
               FOR EACH ROW EXECUTE PROCEDURE gis.bus_trigger_func();
               """)

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TRIGGER IF EXISTS bus_trigger ON gis.bus;")
    op.execute("DROP FUNCTION IF EXISTS gis.bus_trigger_func();")
