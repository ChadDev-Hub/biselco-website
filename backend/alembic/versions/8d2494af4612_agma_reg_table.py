"""agma_reg table

Revision ID: 8d2494af4612
Revises: d67b53c61437
Create Date: 2026-05-08 08:34:31.125190

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8d2494af4612'
down_revision: Union[str, Sequence[str], None] = 'd67b53c61437'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "agma_registration",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("account_no", sa.Text(), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("phone", sa.Text(), nullable=False),
        sa.Column("email", sa.Text(), nullable=True),
        sa.Column("image", sa.Text(), nullable=False),
        sa.Column("signature", sa.Text(), nullable=False),
        sa.Column("timestamped", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["account_no"],
            ["gis.consumer_meter.account_no"],
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        schema="public",
    )
    op.create_index("agma_registration_idx", "agma_registration", ["id"], unique=True, schema="public", if_not_exists=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TABLE IF EXISTS agma_registration;")
    op.execute("DROP INDEX IF EXISTS agma_registration_idx;")
