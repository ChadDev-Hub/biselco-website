"""drop not null on consumer_meter geom

Revision ID: 85d081c383e9
Revises: 8d2494af4612
Create Date: 2026-05-21 08:45:39.331214

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '85d081c383e9'
down_revision: Union[str, Sequence[str], None] = '8d2494af4612'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('consumer_meter', 'geom', schema='gis', nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('consumer_meter', 'geom', schema='gis', nullable=False)