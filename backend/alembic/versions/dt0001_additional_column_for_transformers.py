"""Additional Column for transformers

Revision ID: dt0001
Revises: ecbe2c4ca875
Create Date: 2026-09-16 14:02:52.545008

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dt0001'
down_revision: Union[str, Sequence[str], None] = 'ecbe2c4ca875'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ADD NEW COLUMN FOR GIS DISTRIBUTION TRANSFORMER
    
    
    # =================== PRIMARY VOLTAGE RATING KV =================== #
    op.add_column(
        table_name="distribution_transformer",
        column=sa.Column(
            "primary_voltage_rating_kv", sa.Numeric(precision=10, scale=2), nullable=True
        ),
        schema="gis",
        if_not_exists=True
    )
    
    # ========================= SECONDARY VOLTAGE RATING ============= #
    
    op.add_column(
        table_name = "distribution_transformer",
        column=sa.Column(
            "secondary_voltage_rating_kv",
            sa.Numeric(precision=10, scale=2),
            nullable=True,
        ),
        schema="gis",
        if_not_exists = True
    )


def downgrade() -> None:
    """Downgrade schema."""
    #  REMOVE COLUMN FOR GIS DISTRIBUTION TRANSFORMER
    op.drop_column("distribution_transformer", "primary_voltage_rating_kv", schema="gis", if_exists=True)
    op.drop_column("distribution_transformer", "secondary_voltage_rating_kv", schema="gis", if_exists=True)
