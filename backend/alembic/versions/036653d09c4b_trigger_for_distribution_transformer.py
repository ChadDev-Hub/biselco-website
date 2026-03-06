"""trigger for distribution transformer

Revision ID: 036653d09c4b
Revises: d0bff3d7567f
Create Date: 2026-03-06 10:28:26.212578

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '036653d09c4b'
down_revision: Union[str, Sequence[str], None] = 'd0bff3d7567f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # TRIGGER FUNCTION FOR DISTRIBUTION TRANSFORMER TABLE
    
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.distribution_transformer_trigger_func()
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
                    new.municipality_id = municipal;
                    return new;
               END;
               $$ LANGUAGE plpgsql;
               """)
    
    # TRIGGER CREATIONG
    op.execute("""
               CREATE TRIGGER distribution_transformer_trigger
               BEFORE INSERT OR UPDATE
               ON gis.distribution_transformer
               FOR EACH ROW EXECUTE PROCEDURE gis.distribution_transformer_trigger_func();
               """)
    
    
    # TRIGGER FOR TRANSFORMER LINE BUSHING
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.distribution_linebushing_trigger_func()
               RETURNS TRIGGER AS $$
               DECLARE
                    dt_id text;
                BEGIN
                    SELECT dt.transformer_id
                    INTO dt_id
                    FROM gis.distribution_transformer as dt
                    WHERE st_intersects(dt.geom, st_startpoint(new.geom)) 
                    or st_intersects(dt.geom, st_endpoint(new.geom))
                    LIMIT 1;
                    new.transformer_id = dt_id;
                    return new;
                END $$ LANGUAGE plpgsql;
               """)
    op.execute("""
               CREATE TRIGGER distribution_linebushing_trigger
               BEFORE INSERT OR UPDATE
               ON gis.transformer_linebushing
               FOR EACH ROW EXECUTE PROCEDURE gis.distribution_linebushing_trigger_func();
               """)
    
    # TRIGGER FOR TRANSFORMER LINE BUSHING AFTER
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.transformer_line_bushing_after_func()
               RETURNS TRIGGER AS $$
               BEGIN
                    UPDATE GIS.distribution_transformer as dt
                    SET from_primary_bus_id = bus.bus_id
                    FROM gis.bus as bus
                    WHERE ST_INTERSECTS(ST_STARTPOINT(new.geom), bus.geom)
                    AND bus.description = 'Primary Node'
                    AND dt.transformer_id = new.transformer_id;
                    
                    
                    UPDATE GIS.distribution_transformer as dt
                    SET to_secondary_bus_id = bus.bus_id
                    FROM gis.bus as bus
                    WHERE ST_INTERSECTS(ST_ENDPOINT(new.geom), bus.geom)
                    AND bus.description = 'Secondary Node'
                    AND dt.transformer_id = new.transformer_id;
                RETURN NEW;
                END; $$ LANGUAGE plpgsql;
               """)
    # TRIGGER
    op.execute("""
               CREATE TRIGGER transformer_line_bushing_after
               AFTER INSERT OR UPDATE
               ON gis.transformer_linebushing
               FOR EACH ROW EXECUTE PROCEDURE gis.transformer_line_bushing_after_func();
               """)

    
def downgrade() -> None:
    op.execute("""DROP TRIGGER IF EXISTS distribution_transformer_trigger ON gis.distribution_transformer;""")
    op.execute("""DROP FUNCTION IF EXISTS gis.distribution_transformer_trigger_func();""")
    op.execute("""DROP TRIGGER IF EXISTS distribution_linebushing_trigger ON gis.transformer_linebushing;""")
    op.execute("""DROP FUNCTION IF EXISTS gis.distribution_linebushing_trigger_func();""")
    op.execute("""DROP TRIGGER IF EXISTS transformer_line_bushing_after ON gis.transformer_linebushing;""")
    op.execute("""DROP FUNCTION IF EXISTS gis.transformer_line_bushing_after_func();""")
