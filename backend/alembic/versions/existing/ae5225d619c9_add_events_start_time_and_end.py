"""add events start time and end

Revision ID: ae5225d619c9
Revises: 85d081c383e9
Create Date: 2026-05-22 11:51:31.132732

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ae5225d619c9'
down_revision: Union[str, Sequence[str], None] = '85d081c383e9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        table_name="events",
        column=sa.Column(
            "start_time",
            sa.Time(),
            nullable=True,
        ),
        schema="public",
    )
    op.add_column(
        table_name="events",
        column=sa.Column(
            "end_time",
            sa.Time(),
            nullable=True,
        ),
        schema="public",
    )
    op.alter_column(
        table_name="events",
        column_name="description",
        nullable=True,
        schema="public",
    )
    op.alter_column(
        table_name="events",
        column_name="start_date",
        nullable=True,
    )
    op.alter_column(
        table_name="events",
        column_name="end_date",
        nullable=True,
    )
    op.alter_column("events", "created_at", server_default=sa.func.now(), schema="public")

def downgrade() -> None:
    op.drop_column("events", "start_time", schema="public", if_exists=True)
    op.drop_column("events", "end_time", schema="public", if_exists=True)
    op.alter_column(
        table_name="events",
        column_name="description",
        nullable=False,
        schema="public",
    )
    op.alter_column(
        table_name="events",
        column_name="start_date",
        nullable=False,
    )
    op.alter_column(
        table_name="events",
        column_name="end_date",
        nullable=False,
    )
    op.alter_column("events", "created_at", server_default=None, schema="public")