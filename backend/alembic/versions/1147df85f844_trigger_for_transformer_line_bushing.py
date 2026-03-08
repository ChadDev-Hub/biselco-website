"""transformer_line_bushing

Revision ID: 1147df85f844
Revises: 036653d09c4b
Create Date: 2026-03-07 00:21:57.545861

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "1147df85f844"
down_revision: Union[str, Sequence[str], None] = "036653d09c4b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
               CREATE OR REPLACE FUNCTION gis.transformer_linebushing_func()
               RETURNS TRIGGER AS $$
               BEGIN
               SELECT transformer_id
               INTO new.transformer_id
               FROM gis.distribution_transformer  as dt
               where st_intersects(ST_STARTPOINT(NEW.geom), dt.geom)
               OR st_intersects(ST_ENDPOINT(NEW.geom), dt.geom)
               LIMIT 1;
               RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               """
    )
    op.execute(
        """
               CREATE TRIGGER transformer_linebushing
               BEFORE INSERT OR UPDATE
               ON gis.transformer_linebushing
               FOR EACH ROW EXECUTE FUNCTION gis.transformer_linebushing_func();
               """
    )

    # 
    op.execute(
        """
               CREATE OR REPLACE FUNCTION gis.transformer_linebushing_after_func()
               RETURNS TRIGGER AS $$
               BEGIN
               
            
               UPDATE gis.distribution_transformer as dt
               SET from_primary_bus_id = bus.bus_id
               from gis.bus as bus
               WHERE ST_INTERSECTS(ST_STARTPOINT(NEW.geom), bus.geom)
               AND bus.description = 'Primary Node'
               AND dt.transformer_id = NEW.transformer_id;
               
               

               UPDATE gis.distribution_transformer as dt
               SET to_secondary_bus_id = bus.bus_id
               FROM gis.bus as bus
               WHERE ST_INTERSECTS(ST_ENDPOINT(NEW.geom), bus.geom)
               AND bus.description = 'Secondary Node'
               AND dt.transformer_id = NEW.transformer_id;

               
               UPDATE GIS.bus as b1
               SET 
               substation_id = b2.substation_id,
               feeder_id = b2.feeder_id
               from gis.distribution_transformer as dt
               join gis.bus as b2
               on b2.bus_id = dt.from_primary_bus_id
               where st_intersects(st_endpoint(new.geom), b1.geom)
               AND dt.transformer_id = New.transformer_id;
               
               
               RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               """
    )

    op.execute(
        """
               CREATE TRIGGER transformer_linebushing_after
               AFTER INSERT OR UPDATE
               ON gis.transformer_linebushing
               FOR EACH ROW EXECUTE FUNCTION gis.transformer_linebushing_after_func();
               """
    )


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS transformer_linebushing ON gis.transformer_linebushing;")
    op.execute("DROP FUNCTION IF EXISTS gis.tranformer_linebushing_func();")
    op.execute(
        "DROP TRIGGER IF EXISTS transformer_linebushing_after ON gis.transformer_linebushing;"
    )
    op.execute("DROP FUNCTION IF EXISTS gis.transformer_linebushing_after_func();")
    
