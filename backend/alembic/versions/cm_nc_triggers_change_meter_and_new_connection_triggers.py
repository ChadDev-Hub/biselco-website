"""change meter and new connection triggers

Revision ID: cm_nc_triggers
Revises: dt_additional
Create Date: 2026-10-30 09:59:27.978429

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cm_nc_triggers'
down_revision: Union[str, Sequence[str], None] = 'dt_additional'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # REMOVE UNIQUE CONSTRAINTS ON EMAIL
    op.drop_constraint("users_account_email_key",
                       "users_account", type_="unique", if_exists=True)

    # TRIGGER FOR CHANGE METER
    op.execute(
        """
    CREATE OR REPLACE FUNCTION technical_dep.change_meter_trigger_func()
    RETURNS TRIGGER AS $$
    BEGIN
        -- UPDATE OR INSERT CONSUMER METER
        INSERT INTO gis.consumer_meter
        (geom, account_no, account_name, meter_no, meter_brand, date_installed, image)
        SELECT (new.geom, new.account_no, new.consumer_name, new.new_meter_serial_no, new.new_meter_brand, new.date_accomplished, cmi.image)
        from technical_dep.change_meter_image as cmi
        where cmi.change_meter_id = new.id
        and not new.is_deleted;
        on conflict (account_no) 
        do update set 
        geom = excluded.geom, 
        account_name = excluded.consumer_name, 
        meter_no = excluded.new_meter_serial_no, 
        meter_brand = excluded.new_meter_brand, 
        date_installed = excluded.date_accomplished, 
        image = excluded.image;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql; 
    
    
    CREATE TRIGGER change_meter_trigger
                   BEFORE INSERT OR UPDATE
                   ON technical_dep.change_meter
                   FOR EACH ROW EXECUTE FUNCTION technical_dep.change_meter_trigger_func();
    """
    )
    op.execute(
    """CREATE OR REPLACE FUNCTION gis.update_service_drop_func()
    RETURNS TRIGGER AS $$
    BEGIN
    UPDATE gis.service_drop
    SET geom = ST_SetPoint(
        geom,ST_NPoints(geom) -1,
        ST_SetSRID(ST_MakePoint(
            ST_X(new.geom),
            ST_Y(new.geom)
        ),4326)
    )
    WHERE to_customer_id = new.account_no;
    RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    
    CREATE TRIGGER update_service_drop_trigger
                   AFTER UPDATE
                   ON gis.consumer_meter
                   FOR EACH ROW EXECUTE FUNCTION gis.update_service_drop_func();
    """
    )
    
    
    # TRIGGER FOR NEW_CONNECTION
    
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.new_connection_trigger_func()
               RETURN TRIGGER AS $$
               BEGIN
                    -- UPDATE OR INSERT CONSUMER METER
                    INSERT INTO gis.consumer_meter
                    (geom, account_no, account_name, meter_no, meter_brand, date_installed, image)
                    SELECT (new.geom, new.uuid, new.consumer_name, new.meter_serial_no)
               """)
    

def downgrade() -> None:
    """Downgrade schema."""
    op.create_unique_constraint(
        "users_account_email_key", "users_account", ["email"])
    op.execute(
        """
        DROP TRIGGER IF EXISTS change_meter_trigger ON technical_dep.change_meter;
        DROP FUNCTION IF EXISTS gis.change_meter_trigger_func();
        """
    )
    op.execute(
        """
        DROP TRIGGER IF EXISTS update_service_drop_trigger ON gis.consumer_meter;
        DROP FUNCTION IF EXISTS gis.update_service_drop_func();
        """
    )