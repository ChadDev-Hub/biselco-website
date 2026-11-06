"""replace_consumer_meter_trigger

Revision ID: c38caeb6e149
Revises: a51a0c246209
Create Date: 2026-06-11 03:50:17.587713

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c38caeb6e149'
down_revision: Union[str, Sequence[str], None] = 'a51a0c246209'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
    """CREATE OR REPLACE FUNCTION gis.consumer_meter_trigger_func() RETURNS TRIGGER AS $$
               DECLARE 
                   village integer;
                   municipal integer;
               BEGIN
                   IF NEW.geom is NULL THEN
                       RETURN NEW;
                   END IF;
                   IF NEW.village_id IS NOT NULL 
                   AND NEW.municipality_id IS NOT NULL THEN
                       RETURN NEW;
                   END IF;
                   
                   SELECT b.village_id, b.municipality_id
                   INTO village, municipal
                   FROM gis.boundary as b
                   WHERE st_intersects(b.geom, new.geom)
                   LIMIT 1;
                   new.village_id = village;
                   new.municipality_id = municipal;
                   return new;
               END;
               $$ LANGUAGE plpgsql;
    """
    )
  

def downgrade() -> None:
    """Downgrade schema."""
    op.execute(
        """
               CREATE OR REPLACE FUNCTION gis.consumer_meter_trigger_func() RETURNS TRIGGER AS $$
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
                   new.municipality_id = municipal;
                   return new;
               END;
               $$ LANGUAGE plpgsql;
               """
    )
