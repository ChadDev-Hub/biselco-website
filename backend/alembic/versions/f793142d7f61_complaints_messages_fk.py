"""complaints messages fk

Revision ID: f793142d7f61
Revises: c38caeb6e149
Create Date: 2026-06-11 13:36:20.751740

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f793142d7f61'
down_revision: Union[str, Sequence[str], None] = 'c38caeb6e149'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("complaints_images_complaints_id_fkey", "complaints_images", type_="foreignkey", if_exists=True, )
    op.create_foreign_key("complaints_images_complaints_id_fkey", "complaints_images", "consumer_complaints", ["complaints_id"], ["id"], onupdate="CASCADE", ondelete="CASCADE", )
    
    op.drop_constraint("complaints_message_complaints_id_fkey", "complaints_message", type_="foreignkey", if_exists=True, )
    op.create_foreign_key("complaints_message_complaints_id_fkey", "complaints_message", "consumer_complaints", ["complaints_id"], ["id"], onupdate="CASCADE", ondelete="CASCADE", )
    
    op.drop_constraint("complaints_message_receiver_id_fkey", "complaints_message", type_="foreignkey", if_exists=True, )
    
    op.create_foreign_key("complaints_message_receiver_id_fkey", "complaints_message", "users_account", ["receiver_id"], ["id"], onupdate="CASCADE", ondelete="CASCADE", )
    
    op.drop_constraint("complaints_message_sender_id_fkey", "complaints_message", type_="foreignkey", if_exists=True, )
    op.create_foreign_key("complaints_message_sender_id_fkey", "complaints_message", "users_account", ["sender_id"], ["id"], onupdate="CASCADE", ondelete="CASCADE", )


    op.drop_constraint("complaints_status_history_complaint_id_fkey", "complaints_status_history", type_="foreignkey", if_exists=True,)
    op.create_foreign_key("complaints_status_history_complaint_id_fkey", "complaints_status_history", "consumer_complaints", ["complaint_id"], ["id"], onupdate="CASCADE", ondelete="CASCADE", )    
    

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("complaints_message_sender_id_fkey", "complaints_message", type_="foreignkey", if_exists=True, )
    op.create_foreign_key("complaints_message_sender_id_fkey", "complaints_message", "users_account", ["sender_id"], ["id"], )
    
    op.drop_constraint("complaints_message_receiver_id_fkey", "complaints_message", type_="foreignkey", if_exists=True, )
    op.create_foreign_key("complaints_message_receiver_id_fkey", "complaints_message", "users_account", ["receiver_id"], ["id"], )
    
    op.drop_constraint("complaints_message_complaints_id_fkey", "complaints_message", type_="foreignkey", if_exists=True, )
    op.create_foreign_key("complaints_message_complaints_id_fkey", "complaints_message", "consumer_complaints", ["complaints_id"], ["id"], )
    
    op.drop_constraint("complaints_images_complaints_id_fkey", "complaints_images", type_="foreignkey", if_exists=True, )
    op.create_foreign_key("complaints_images_complaints_id_fkey", "complaints_images", "consumer_complaints", ["complaints_id"], ["id"], )
    
    
    op.drop_constraint("complaints_status_history_complaint_id_fkey", "complaints_status_history", type_="foreignkey", if_exists=True,)
    op.create_foreign_key("complaints_status_history_complaint_id_fkey", "complaints_status_history", "consumer_complaints", ["complaint_id"], ["id"], )
