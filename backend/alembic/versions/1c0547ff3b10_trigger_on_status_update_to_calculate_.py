"""trigger on status update to calculate resolution time

Revision ID: 1c0547ff3b10
Revises: 1189dc695fda
Create Date: 2026-04-09 19:57:34.129896

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1c0547ff3b10'
down_revision: Union[str, Sequence[str], None] = '1189dc695fda'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
               CREATE OR REPLACE FUNCTION complaints_status_trigger_after_func()
               RETURNS TRIGGER AS $$
               DECLARE 
                    start_ts TIMESTAMP;
                    end_ts TIMESTAMP;
               BEGIN
                IF (TG_OP = 'INSERT' AND NEW.status_id = 4) OR
                    (TG_OP = 'UPDATE' AND OLD.status_id = 2 AND NEW.status_id = 4) THEN
                    SELECT timestamped INTO start_ts
                    FROM complaints_status
                    WHERE complaint_id = NEW.complaint_id AND status_id = 2
                    ORDER BY timestamped DESC
                    limit 1; 
                    
                    SELECT timestamped INTO end_ts
                    FROM complaints_status
                    WHERE complaint_id = NEW.complaint_id AND status_id = 4
                    ORDER BY timestamped DESC
                    limit 1; 
                    
                    UPDATE consumer_complaints
                    SET resolution_time = end_ts - start_ts
                    WHERE id = NEW.complaint_id;
                ELSE 
                    UPDATE consumer_complaints
                    SET resolution_time = NULL
                    WHERE id = COALESCE(NEW.complaint_id, OLD.complaint_id);
                END IF;
                RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
               """)
    op.execute("""
                CREATE TRIGGER complaint_status_trigger_after
                AFTER INSERT OR UPDATE OR DELETE ON complaints_status
                FOR EACH ROW EXECUTE FUNCTION complaints_status_trigger_after_func();
                """)

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP TRIGGER IF EXISTS complaint_status_trigger_after ON complaints_status;")
    op.execute("DROP FUNCTION IF EXISTS complaint_status_trigger_after_func();")
