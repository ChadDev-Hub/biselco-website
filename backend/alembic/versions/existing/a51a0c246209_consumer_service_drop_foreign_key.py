"""consumer_service_drop_foreign_key

Revision ID: a51a0c246209
Revises: d6b2772c809b
Create Date: 2026-06-11 03:18:15.761559

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a51a0c246209'
down_revision: Union[str, Sequence[str], None] = 'd6b2772c809b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint(constraint_name="service_drop_to_customer_id_fkey", table_name="service_drop", type_="foreignkey", schema="gis", if_exists=True)
    
    op.create_foreign_key(constraint_name="service_drop_to_customer_id_fkey", source_table="service_drop", referent_table="consumer_meter",source_schema="gis", referent_schema="gis",  local_cols=["to_customer_id"], remote_cols=["account_no"],  onupdate="CASCADE", ondelete="CASCADE")

    op.add_column("consumer_meter", sa.Column("is_solar", sa.Boolean(), nullable=True, server_default=sa.false()), schema="gis")
    op.add_column("consumer_meter", sa.Column("is_agma", sa.Boolean(), nullable=True, server_default=sa.false()), schema="gis")
    
def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(constraint_name="service_drop_to_customer_id_fkey",table_name= "service_drop", type_="foreignkey", schema="gis", if_exists=True)
    
    op.drop_column("consumer_meter", "is_solar", schema="gis", if_exists=True)
    op.drop_column("consumer_meter", "is_agma", schema="gis", if_exists=True)
    
