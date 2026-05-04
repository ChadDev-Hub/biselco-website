"""events table creation

Revision ID: d67b53c61437
Revises: 1c0547ff3b10
Create Date: 2026-05-04 13:26:58.417666

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd67b53c61437'
down_revision: Union[str, Sequence[str], None] = '1c0547ff3b10'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, default=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        schema="public"
    )
    op.create_index("events_idx", "events", ["id"], unique=True, schema="public", if_not_exists=True)
    
    op.create_table(
        "event_images",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("event_id", sa.Integer(), nullable=False),
        sa.Column("upload_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(
            ["event_id"], ["events.id"], 
            ondelete="CASCADE", 
            onupdate="CASCADE", 
            use_alter=True
        )
    )
    op.create_index("event_images_idx", "event_images", ["id"], unique=True, schema="public", if_not_exists=True)

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TABLE IF EXISTS events_images;")
    op.execute("DROP TABLE IF EXISTS events;")
    op.execute("DROP INDEX IF EXISTS events_idx;")
    op.execute("DROP INDEX IF EXISTS event_images_idx;")
