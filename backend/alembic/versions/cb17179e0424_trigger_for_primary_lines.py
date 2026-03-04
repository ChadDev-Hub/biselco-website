"""trigger_for_primary_lines

Revision ID: cb17179e0424
Revises: 054fe1c14cc2
Create Date: 2026-03-04 14:42:32.070428

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cb17179e0424'
down_revision: Union[str, Sequence[str], None] = '054fe1c14cc2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
               CREATE OR REPLACE FUNCTION primary_lines_trigg_func()
               RETURNS TRIGGER AS $$
               DECLARE
               substation_id text;
               feeder_id text;
               from_bus text;
               to_bus text;
               village integer;
               
               municipality integer;
               
               BEGIN
               SELECT b.bus_id, b.description, b.substation_id
               INTO from_bus
               FROM gis.bus b
               WHERE st_intersects(b.geom, st_startpoint(new.geom))
               AND b.description = 'Primary Node'
               LIMIT 1;
               
               SELECT b.bus_id
               INTO to_bus
               FROM gis.bus b
               WHERE st_intersects(b.geom, st_endpoint(new.geom))
               AND b.description = 'Primary Node'
               LIMIT 1; 
               
               
               SELECT b.village_id, b.municipality_id
               INTO village, municipality
               FROM gis.boundary b
               WHERE st_intersects(b.geom, st_endpoint(new.geom))
               LIMIT 1;
               
               IF village IS NULL AND municipality IS NULL THEN 
               RAISE EXCEPTION 'No Matching Boundary Found';
               END IF;
               
               IF from_bus IS NULL OR to_bus IS NULL THEN 
               RAISE EXCEPTION 'No Matching Bus Found';
               END IF;
               
               new.from_bus_id = from_bus;
               new.to_bus_id = to_bus;
               new.village_id = village;
               new.municipality_id = municipality;
               return new;
               END;
               $$ LANGUAGE plpgsql;
               """)
    
    op.execute("""
               CREATE OR REPLACE FUNCTION primary_lines_trigg_after_func()
               RETURNS TRIGGER AS $$
               BEGIN
               -- UPDATE GIS BUS OR NODE
               
               UPDATE gis.bus as target
               SET substation_id = source.substation_id
               from gis.bus as source
               where source.bus_id = new.from_bus_id
               AND target.bus_id = new.to_bus_id
               AND target.description = 'Primary Node';
               RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               """)
    
    op.execute("""
               CREATE TRIGGER primary_lines_trigg
               BEFORE INSERT OR UPDATE
               ON gis.primary_lines
               FOR EACH ROW EXECUTE PROCEDURE primary_lines_trigg_func();
               """)
    
    op.execute("""
               CREATE TRIGGER primary_lines_trigg_after
               AFTER INSERT OR UPDATE
               ON gis.primary_lines
               FOR EACH ROW EXECUTE PROCEDURE primary_lines_trigg_after_func();
               """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TRIGGER IF EXISTS primary_lines_trigg_after ON gis.primary_lines;")
    op.execute("DROP FUNCTION IF EXISTS primary_lines_trigg_after_func();")
    op.execute("DROP TRIGGER IF EXISTS primary_lines_trigg ON gis.primary_lines;")
    op.execute("DROP FUNCTION IF EXISTS primary_lines_trigg_func();")