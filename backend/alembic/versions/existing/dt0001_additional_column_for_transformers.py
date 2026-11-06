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
    # ADD NEW COLUMN FOR GIS TRANSFORMER TYPE 
    
    op.add_column(
        table_name="transformer_type",
        column=sa.Column(
            "phase",
            sa.String(length=2),
            nullable=True
        ),
        schema="gis"
    )
    
    op.add_column(
        table_name="transformer_type",
        column=sa.Column(
            "%_z",
            sa.NUMERIC(precision=10, scale=4),
            nullable=True
        ),
        schema="gis"
    )
    
    
    op.add_column(
        table_name="transformer_type",
        column=sa.Column(
            "x_r_ratio",
            sa.NUMERIC(precision=10, scale=4),
            nullable=True
        ),
        schema="gis"
    )
    
    op.add_column(
        table_name="transformer_type",
        column=sa.Column(
            "no_load_loss_kw",
            sa.NUMERIC(precision=10, scale=4),
            nullable=True
        ),
        schema="gis"
    )
    
    op.add_column(
        table_name="transformer_type",
        column=sa.Column(
            "exciting_current_%",
            sa.Float(),
            nullable=True
        ),
        schema="gis"
    )
    
    # DROP OLD COLUMN
    op.drop_column("transformer_type", "name", schema="gis", if_exists=True)
    # CREATE NEW COLUMN
    op.add_column(
        table_name="transformer_type",
        column=sa.Column(
            "name",
            sa.Text(),
            sa.Computed(
                sqltext="""phase || ' ' || kva_rating || ' ' || '/' || ' ' || primary_voltage_rating || 'Kv' || ' ' || secondary_voltage_rating || 'Kv' """,
                persisted=True
            ),
            nullable=True,
        ),
        schema="gis",
    )
    

    # ============= ALTER TRANSpFORMER TYPE COLUMNS


def downgrade() -> None:
    """Downgrade schema."""
    #  REMOVE COLUMN FOR GIS DISTRIBUTION TRANSFORMER
    op.drop_column("distribution_transformer", "primary_voltage_rating_kv", schema="gis", if_exists=True)
    op.drop_column("distribution_transformer", "secondary_voltage_rating_kv", schema="gis", if_exists=True)

    
    op.drop_column("transformer_type", "phase", schema="gis", if_exists=True)
    op.drop_column("transformer_type", "%_z", schema="gis", if_exists=True)
    op.drop_column("transformer_type", "x_r_ratio", schema="gis", if_exists=True)
    op.drop_column("transformer_type", "no_load_loss_kw", schema="gis", if_exists=True)
    op.drop_column("transformer_type", "exciting_current_%", schema="gis", if_exists=True)
    op.drop_column("transformer_type", "name", schema="gis", if_exists=True)