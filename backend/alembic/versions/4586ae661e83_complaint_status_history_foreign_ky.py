"""complaint_status_history_foreign_ky

Revision ID: 4586ae661e83
Revises: f793142d7f61
Create Date: 2026-06-12 10:49:35.940421

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4586ae661e83'
down_revision: Union[str, Sequence[str], None] = 'f793142d7f61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('complaints_status_history_user_id_fkey', 'complaints_status_history', type_='foreignkey')
    op.create_foreign_key('complaints_status_history_user_id_fkey', 'complaints_status_history', 'users_account', ['user_id'], ['id'], onupdate='CASCADE', ondelete='CASCADE')


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('complaints_status_history_user_id_fkey', 'complaints_status_history', type_='foreignkey')
    op.create_foreign_key('complaints_status_history_user_id_fkey', 'complaints_status_history', 'users_account', ['user_id'], ['id'])
