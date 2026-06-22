"""verification_monitoring_table

Revision ID: 3579b8ff11f9
Revises: 001379cc2ad8
Create Date: 2026-06-22 08:25:27.117880

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3579b8ff11f9'
down_revision: Union[str, Sequence[str], None] = '001379cc2ad8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "agma_verification_monitoring",
        sa.Column('id',sa.Integer(), primary_key=True),
        sa.Column('agma_ticket_id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('timestamped', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users_account.id'], ondelete="CASCADE", onupdate="CASCADE"),
        sa.ForeignKeyConstraint(['agma_ticket_id'], ['agma_registration.id'], ondelete="CASCADE", onupdate="CASCADE"),
        schema="public",
        if_not_exists=True
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("agma_verification_monitoring", schema="public", if_exists=True)
