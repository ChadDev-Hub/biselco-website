"""Add Forms Values

Revision ID: 7499238324dd
Revises: 27511fd811f9
Create Date: 2026-02-26 10:51:58.011607

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7499238324dd'
down_revision: Union[str, Sequence[str], None] = '27511fd811f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
               INSERT INTO form (department_id, form_name, form_description)
               values 
                (1, 'NEW CONNECTION', 'form for submitting new connection or new meters accomplishments'),
                (1, 'CHANGE METER', 'form for submitting change meter accomplishments for existing meters')
                on conflict ( form_name) do update
                set form_description = excluded.form_description;
               """)

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
               ALTER SEQUENCE form_id_seq RESTART WITH 1;
               """)
    op.execute("""
               DELETE FROM form WHERE form_name in ('new_meter', 'change_meter');
               """)
