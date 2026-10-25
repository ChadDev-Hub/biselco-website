"""additional column for distribution transformer

Revision ID: dt_additional
Revises: user_name
Create Date: 2026-10-22 00:32:07.532002

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dt_additional'
down_revision: Union[str, Sequence[str], None] = 'user_name'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column(
        table_name="consumer_meter",
        column_name="hash",
        schema="gis",
        if_exists=True
    )
    # drop constraints on consumer hash
    op.drop_constraint(
        "consumer_meter_hash_key",
        "consumer_meter",
        schema="gis",
        type_="unique",
        if_exists=True
    )

    # ADD NEW HASH
    op.add_column(
        table_name="consumer_meter",
        column=sa.Column(
            "hash",
            sa.String(length=64),
            sa.Computed(
                sa.text(
                    """
                encode(
                    digest(
                        coalesce(st_x(geom)::text,'') || '|' ||
                        coalesce(st_y(geom)::text,'') || '|' ||
                        coalesce(account_no::text, '') || '|' ||
                        coalesce(account_name::text, '') || '|' ||
                        coalesce(account_type::text, '') || '|' ||
                        coalesce(meter_no::text, '') || '|' ||
                        coalesce(meter_brand::text, '') || '|' ||
                        coalesce(village_id::text, '') || '|' ||
                        coalesce(municipality_id::text, ''),
                        'sha256'
                    ),
                    'hex'  
                )
                """
                ),
                persisted=True
            ),
            unique=True,
            nullable=False
        ),
        schema="gis",
        if_not_exists=True
    )
    
    
    # GIS DITRIBUTION TRANSFORMER 
    op.create_table(
        "no_of_dt_in_bank",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
            primary_key=True,
        ),
        sa.Column(
            "code",
            sa.VARCHAR(20),
            unique=True,
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.CHAR(),
            nullable=False,
        ),
        schema="gis",
        if_not_exists=True,
    )

    
    op.add_column(
        "distribution_transformer",
        sa.Column(
            "no_dt_in_bank",
            sa.VARCHAR(20),
            sa.ForeignKey("gis.no_of_dt_in_bank.code", ondelete="CASCADE", onupdate="CASCADE"),
            nullable=True
        ),
        schema="gis",
        if_not_exists=True
    )
    
    

def downgrade() -> None:
    """Downgrade schema."""
    # DISTRIBUTION TRANSOFMER DOWNGRADE 
    op.drop_column(
        table_name="distribution_transformer",
        column_name="no_dt_in_bank",
        schema="gis",
        if_exists=True
    )
    
    op.drop_table(
        "no_of_dt_in_bank",
        schema="gis",
        if_exists=True
    )
    # GIS CONSUMER METER DOWNGRADE
    op.drop_column(
        table_name="consumer_meter",
        column_name="hash",
        schema="gis",
        if_exists=True
    )

    # drop constraints on consumer hash
    op.drop_constraint(
        "consumer_meter_hash_key",
        "consumer_meter",
        schema="gis",
        type_="unique",
        if_exists=True
    )

    # ADD COLUMN FOR CONSUMER METER
    op.add_column(
        "consumer_meter",
        sa.Column(
            "hash",
            sa.String(64),
            sa.Computed(
                sa.text(
                    """
                       encode(
                           digest(
                                coalesce(account_no::text, '') || '|' ||
                                coalesce(account_name::text, '') || '|' ||
                                coalesce(account_type::text, '') || '|' ||
                                coalesce(meter_no::text, '') || '|' ||
                                coalesce(meter_brand::text, '') || '|' ||
                                coalesce(village_id::text, '') || '|' ||
                                coalesce(municipality_id::text, ''),
                                'sha256'
                            ),
                            'hex'  
                       )
                       """
                ),
                persisted=True
            ),
            unique=True,
            nullable=False
        ),
        schema="gis",
        if_not_exists=True
    )
