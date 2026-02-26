"""Add Departments

Revision ID: c68f261e2ed3
Revises: 368322f04e94
Create Date: 2026-02-26 09:34:56.177565

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c68f261e2ed3'
down_revision: Union[str, Sequence[str], None] = '368322f04e94'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
               INSERT INTO departments (name, description)
               values 
                ('TSD', 'Technical Services Department'),
                ('FSD', 'Financial Services Department'),
                ('ISD', 'Information Services Department'),
                ('ASD' , 'Area Services Department'),
                ('OGM', 'Office of The General Manager')
               ON Conflict (name) do update 
                set description = excluded.description;
               """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
               ALTER SEQUENCE departments_id_seq RESTART WITH 1;
               """)
    op.execute("""
               DELETE FROM departments WHERE name in ('TSD', 'FSD', 'ISD', 'ASD');
               """)
    
