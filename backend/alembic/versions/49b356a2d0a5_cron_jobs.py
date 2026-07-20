"""cron_jobs

Revision ID: 49b356a2d0a5
Revises: 35ca2e9d2d67
Create Date: 2026-07-20 08:48:11.205546

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '49b356a2d0a5'
down_revision: Union[str, Sequence[str], None] = '35ca2e9d2d67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute(
        'CREATE EXTENSION IF NOT EXISTS pg_cron;'
    )

    op.execute(
        '''
        CREATE OR REPLACE FUNCTION clean_deleted_change_meters()
        returns void as
        $$
        BEGIN
            DELETE FROM gis.change_meter cm
            WHERE is_deleted and datetime_synced < now() - interval '5 days';
        END;
        $$
        language plpgsql;
        '''
    )

    op.execute(
        """select cron.schedule(
            'clean_deleted_change_meters',
            '0 0 * * *',
            'select clean_deleted_change_meters();'
            );
        """
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.execute(
        'DROP FUNCTION IF EXISTS clean_deleted_change_meters();'
    )
    op.execute(
        """
        SELECT cron.unschedule('clean_deleted_change_meters');
        """
    )