"""add_additional_column_on_agma_registration

Revision ID: d6b2772c809b
Revises: 9971d52116f5
Create Date: 2026-06-05 11:36:56.624590

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd6b2772c809b'
down_revision: Union[str, Sequence[str], None] = '9971d52116f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        table_name="agma_registration",
        column=sa.Column("sample_bill", sa.Text(), nullable=True),
        schema="public"
    )
    
    op.add_column(
        table_name="agma_registration",
        column=sa.Column("is_winner", sa.Boolean(), nullable=True, server_default=sa.false()),
        schema="public")
    op.add_column(
        table_name="agma_registration",
        column=sa.Column("is_dismissed", sa.Boolean(), nullable=True, server_default=sa.false()),
        schema="public"
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("agma_registration", "sample_bill", schema="public", if_exists=True)
    op.drop_column("agma_registration", "is_winner", schema="public", if_exists=True)
    op.drop_column("agma_registration", "is_dismissed", schema="public", if_exists=True)