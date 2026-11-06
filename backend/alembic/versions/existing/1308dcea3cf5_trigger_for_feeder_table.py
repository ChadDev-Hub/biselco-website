"""trigger_for_feeder_table

Revision ID: 1308dcea3cf5
Revises: 3ec811e2f295
Create Date: 2026-03-04 10:52:20.719806

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1308dcea3cf5'
down_revision: Union[str, Sequence[str], None] = '3ec811e2f295'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.execute(
        """
        CREATE OR REPLACE FUNCTION gis.feeder_trigger_func()
        RETURNS TRIGGER AS $$
        DECLARE
            village integer;
            municipal integer;
            
        BEGIN
            SELECT b.village_id, b.municipality_id
            INTO village, municipal
            FROM gis.boundary as b
            WHERE st_intersects(b.geom, new.geom)
            LIMIT 1;
            
            new.village_id = village;
            new.municipal_id = municipal;
            return new;
        END;
        $$ LANGUAGE plpgsql;
        """
    )

    op.execute("""
                CREATE OR REPLACE FUNCTION gis.feeder_trigger_after_func()
                RETURNS TRIGGER AS $$
                BEGIN
                     -- UPDATE GIS BUS OR NODE
            UPDATE gis.bus as n
            SET 
            is_active = new.is_active,
            feeder_id = new.feeder_id,
            substation_id = new.substation_id
            where n.id in (
                SELECT id 
                FROM gis.bus as a
                WHERE st_intersects(a.geom, new.geom)
                OR a.feeder_id = new.feeder_id
                );
            RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
               """)

    op.execute("""
           CREATE TRIGGER feeder_trigger
           BEFORE INSERT OR UPDATE 
           ON gis.feeder
           FOR EACH ROW EXECUTE FUNCTION gis.feeder_trigger_func();
           """)
    
    op.execute("""
               CREATE TRIGGER feeder_trigger_after
               AFTER INSERT OR UPDATE 
               ON gis.feeder
               FOR EACH ROW EXECUTE FUNCTION gis.feeder_trigger_after_func();
               """)

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TRIGGER IF EXISTS feeder_trigger_after ON gis.feeder;")
    op.execute("DROP FUNCTION IF EXISTS gis.feeder_trigger_after_func();")
    op.execute("DROP TRIGGER IF EXISTS feeder_trigger ON gis.feeder;")
    op.execute("DROP FUNCTION IF EXISTS gis.feeder_trigger_func();")
