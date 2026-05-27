"""creating unique contraint on events title

Revision ID: ed535f986750
Revises: ae5225d619c9
Create Date: 2026-05-27 22:16:08.155877

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ed535f986750'
down_revision: Union[str, Sequence[str], None] = 'ae5225d619c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_unique_constraint('events_title_key', 'events', ['title'], schema='public')
    


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('events_title_key', 'events', schema='public')
