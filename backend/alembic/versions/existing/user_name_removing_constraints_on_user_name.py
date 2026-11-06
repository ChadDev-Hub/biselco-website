"""removing constraints_on_user_name

Revision ID: user_name
Revises: users_account_new_column
Create Date: 2026-10-07 11:22:13.626702

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'user_name'
down_revision: Union[str, Sequence[str], None] = 'users_account_new_column'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint("users_account_user_name_key", "users_account", type_="unique", if_exists=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.create_unique_constraint("users_account_user_name_key", "users_account", ["user_name"])
