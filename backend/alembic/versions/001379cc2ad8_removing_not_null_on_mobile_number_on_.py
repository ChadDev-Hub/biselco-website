"""removing not null on mobile number on agma registration

Revision ID: 001379cc2ad8
Revises: 5cc9c7a5b10a
Create Date: 2026-06-20 21:34:28.582891

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001379cc2ad8'
down_revision: Union[str, Sequence[str], None] = '5cc9c7a5b10a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('agma_registration', 'phone', nullable=True)
    op.alter_column('event_schedules',"event_date", type_=sa.TIMESTAMP(timezone=True), existing_type=sa.TIMESTAMP(timezone=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('agma_registration', 'phone', nullable=False)
    op.alter_column('event_schedules',"event_date", type_=sa.TIMESTAMP(timezone=False), existing_type=sa.TIMESTAMP(timezone=True))