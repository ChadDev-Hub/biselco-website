"""agma winner timestamp

Revision ID: 49b356a2d0a5
Revises: 35ca2e9d2d67
Create Date: 2026-07-20 08:48:11.205546

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '49b356a2d0a5'
down_revision: Union[str, Sequence[str], None] = '35ca2e9d2d67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        table_name="agma_registration",
        column=sa.Column("win_timestamp", sa.DateTime(timezone=True), nullable=True),
        schema="public"
    )
    op.add_column(
        table_name="agma_registration",
        column=sa.Column("dismiss_timestamp", sa.DateTime(timezone=True), nullable=True),
        schema="public"
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("agma_registration", "dismiss_timestamp", schema="public", if_exists=True)
    op.drop_column("agma_registration", "win_timestamp", schema="public", if_exists=True)