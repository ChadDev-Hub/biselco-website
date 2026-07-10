"""create uuid on change meter and new connection

Revision ID: 35ca2e9d2d67
Revises: 3579b8ff11f9
Create Date: 2026-07-07 15:34:50.285438

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '35ca2e9d2d67'
down_revision: Union[str, Sequence[str], None] = '3579b8ff11f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ADDITIONAL COLUMNS AND CONSTRAINTS
    # NEW CONNECTION
    op.add_column(
        "new_connection", 
        sa.Column("uuid", sa.UUID(), nullable=False, server_default=sa.text("gen_random_uuid()")),
        schema="technical_dep",
    )
    op.add_column(
        "new_connection",
        sa.Column("is_synced", sa.Boolean(), nullable=True, server_default=sa.false()),
        schema="technical_dep",
    )
    op.add_column(
        "new_connection",
        sa.Column("sitio", sa.Text(), nullable=True),
        schema="technical_dep",
    )
    op.add_column(
        "new_connection_image",
        sa.Column("image_hash", sa.String(length=64), nullable=True),
        schema="technical_dep",
    )
    op.create_unique_constraint("new_connection_uuid_key", "new_connection", ["uuid"], schema="technical_dep")
    # CHANGE METER
    op.add_column(
        "change_meter", 
        sa.Column("uuid", sa.UUID(), nullable=False, server_default=sa.text("gen_random_uuid()")),
        schema="technical_dep",

    )
    op.add_column(
        "change_meter",
        sa.Column("is_synced", sa.Boolean(), nullable=True, server_default=sa.false()),
        schema="technical_dep",
    )
    op.add_column(
        "change_meter",
        sa.Column("sitio", sa.Text(), nullable=True),
        schema="technical_dep",
    )
    op.add_column(
        "change_meter_image",
        sa.Column("image_hash", sa.String(length=64), nullable=True),
        schema="technical_dep",
    )
    op.create_unique_constraint("change_meter_uuid_key", "change_meter", ["uuid"], schema="technical_dep")


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("change_meter_uuid_key", "change_meter", schema="technical_dep", if_exists=True)
    op.drop_constraint("new_connection_uuid_key", "new_connection", schema="technical_dep", if_exists=True)
    op.drop_column("change_meter", "uuid", schema="technical_dep", if_exists=True)
    op.drop_column("new_connection", "uuid", schema="technical_dep", if_exists=True)
    op.drop_column("change_meter", "sitio", schema="technical_dep", if_exists=True)
    op.drop_column("new_connection", "sitio", schema="technical_dep", if_exists=True)
    op.drop_column("change_meter", "is_synced", schema="technical_dep", if_exists=True)
    op.drop_column("new_connection", "is_synced", schema="technical_dep", if_exists=True)
    op.drop_column("new_connection_image", "image_hash", schema="technical_dep", if_exists=True)
    op.drop_column("change_meter_image", "image_hash", schema="technical_dep", if_exists=True)