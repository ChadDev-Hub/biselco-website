"""empty message

Revision ID: users_account_new_column
Revises: dt0001
Create Date: 2026-10-01 10:06:17.121909

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'users_account_new_column'
down_revision: Union[str, Sequence[str], None] = 'dt0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column("users_account", "email", nullable=True, unique=False, schema="public")
    op.alter_column("users_account", "user_name", nullable=True, unique=False, schema="public")
    
    
    op.add_column("users_account", sa.Column("provider_id", sa.Text(), nullable=True, unique=False), schema="public")
    op.add_column("users_account", sa.Column("provider", sa.Text(), nullable=True), schema="public")
    op.add_column("users_account", sa.Column("provider_token", sa.Text(), nullable=True), schema="public")
    op.add_column("users_account", sa.Column("hash", sa.String(length=64), nullable=True, unique=True), schema="public")
    op.add_column("users_account", sa.Column("login_at", sa.DateTime(timezone=True), nullable=True), schema="public")
    

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users_account", "login_at", schema="public")
    op.drop_column("users_account", "hash", schema="public")
    op.drop_column("users_account", "provider_token", schema="public")
    op.drop_column("users_account", "provider", schema="public")
    op.drop_column("users_account", "provider_id", schema="public")
    op.alter_column("users_account", "user_name", nullable=False, unique=True, schema="public")
    op.alter_column("users_account", "email", nullable=False, unique=True, schema="public")
