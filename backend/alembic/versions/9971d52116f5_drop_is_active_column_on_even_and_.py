"""drop_is_active_column_on_even_and_adding_evenschedules_table

Revision ID: 9971d52116f5
Revises: ed535f986750
Create Date: 2026-05-28 16:23:15.646108

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9971d52116f5'
down_revision: Union[str, Sequence[str], None] = 'ed535f986750'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("events", "is_active", schema="public", if_exists=True)
    op.create_table(
        "event_schedules",
        sa.Column("id", sa.UUID(), nullable=False, primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("event_id", sa.Integer(), nullable=False),
        sa.Column("area", sa.Text(), nullable=True),
        sa.Column("event_location", sa.Text(), nullable=True),
        sa.Column("event_date", sa.TIMESTAMP(timezone=False), nullable=True),
        
        sa.ForeignKey("event_id", ["public.events.id"], ondelete="CASCADE", onupdate="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        schema="public",
    )
    op.create_index("event_schedules_idx", "event_schedules", ["id"], unique=True, schema="public", if_not_exists=True)

def downgrade() -> None:
    op.add_column(
        table_name="events",
        column=sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=True,
            default=True,
        ))
    op.drop_index("event_schedules_idx", "event_schedules", schema="public", if_exists=True)
    op.drop_table("event_schedules", schema="public", if_exists=True)