"""Add Construction and Maintenance Form

Revision ID: d22b568869ef
Revises: 7499238324dd
Create Date: 2026-02-26 16:10:53.627802

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd22b568869ef'
down_revision: Union[str, Sequence[str], None] = '7499238324dd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
               INSERT INTO FORM (department_id, form_name, form_description)
               VALUES 
                (1, 'CONSTRUCTION DAILY', 'Form For Submitting Construction Accomplishments'),
                (1, 'MAINTENANCE DAILY', 'Form For Submitting Maintenance Accomplishments')
                on conflict ( form_name) do update
                set form_description = excluded.form_description;
               """)


def downgrade() -> None:
    op.execute("""
               DELETE FROM form WHERE form_name in ('CONSTRUCTION DAILY', 'MAINTENANCE DAILY');
               """)
