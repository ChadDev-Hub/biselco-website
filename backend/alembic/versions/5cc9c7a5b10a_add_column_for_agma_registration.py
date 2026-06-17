"""add_column_for_agma_registration

Revision ID: 5cc9c7a5b10a
Revises: 4586ae661e83
Create Date: 2026-06-17 11:12:44.509196

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5cc9c7a5b10a'
down_revision: Union[str, Sequence[str], None] = '4586ae661e83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("agma_registration", sa.Column("authorization_letter", sa.Text(), nullable=True), schema="public")
    


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("agma_registration", "authorization_letter", schema="public", if_exists=True)
