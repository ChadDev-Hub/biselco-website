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
    
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.distribution_transformer_trigger_after_func()
               RETURNS TRIGGER AS $$
               BEGIN
                    UPDATE gis.bus as bus
                    SET is_active = new.is_active
                    FROM gis.transformer_linebushing as tl
                    where tl.transformer_id = new.transformer_id
                    AND st_intersects(st_endpoint(tl.geom), bus.geom)
                    AND bus.description = 'Secondary Node';
                    RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               
               """)
    op.execute("""
               CREATE TRIGGER distribution_transformer_trigger_after
               AFTER INSERT OR UPDATE
               ON gis.distribution_transformer
               FOR EACH ROW EXECUTE PROCEDURE gis.distribution_transformer_trigger_after_func();
               """)
    
def downgrade() -> None:
    op.execute("""DROP TRIGGER IF EXISTS distribution_transformer_trigger ON gis.distribution_transformer;""")
    op.execute("""DROP FUNCTION IF EXISTS gis.distribution_transformer_trigger_func();""")
    op.execute("""DROP TRIGGER IF EXISTS distribution_transformer_trigger_after ON gis.distribution_transformer;""")
    op.execute("""DROP FUNCTION IF EXISTS gis.distribution_transformer_trigger_after_func();""")