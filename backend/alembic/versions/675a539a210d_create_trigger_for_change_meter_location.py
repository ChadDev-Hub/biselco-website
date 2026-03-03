"""create_trigger_for_change_meter_location

Revision ID: 675a539a210d
Revises: c71825e4d3ca
Create Date: 2026-03-02 21:49:23.707848

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '675a539a210d'
down_revision: Union[str, Sequence[str], None] = 'c71825e4d3ca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE OR REPLACE FUNCTION change_meter_location()
        RETURNS TRIGGER AS $$
        DECLARE
            location text;
        BEGIN
            SELECT b.location INTO location
            FROM gis.boundary b
            WHERE st_intersects(b.geom, new.geom)
            LIMIT 1;
        new.location = location;
        return new;
        END;
        $$ LANGUAGE plpgsql;
"""
    )

    op.execute(
        """
        CREATE TRIGGER change_meter_location
        BEFORE INSERT OR UPDATE
        ON technical_dep.change_meter
        FOR EACH ROW EXECUTE PROCEDURE change_meter_location();
    """
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TRIGGER change_meter_location ON technical_dep.change_meter;")
    op.execute("DROP FUNCTION change_meter_location();")
