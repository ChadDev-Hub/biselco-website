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
    op.add_column(
        "change_meter", 
        sa.Column(
            "is_reported",
            sa.Boolean(),
            nullable=True,
            server_default=sa.false()
        ),
        schema="technical_dep"
    )
    op.add_column(
        "change_meter",
        sa.Column(
            "datetime_reported",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        schema="technical_dep",
    )
    # TRIGGER FOR CHANGE METER
    op.execute(
        """
    CREATE OR REPLACE FUNCTION technical_dep.change_meter_trigger_func()
    RETURNS TRIGGER AS $$
    BEGIN
        -- UPDATE OR INSERT CONSUMER METER
        if new.is_reported then
            INSERT INTO gis.consumer_meter
            (geom, account_no, account_name, meter_no, meter_brand, date_installed, image)
            SELECT new.geom, new.account_no, new.consumer_name, new.new_meter_serial_no, new.new_meter_brand, new.date_accomplished, cmi.image
            from technical_dep.change_meter_image as cmi
            where cmi.change_meter_id = new.id
            and not new.is_deleted
            on conflict (account_no) 
            do update set 
            geom = excluded.geom, 
            account_name = excluded.account_name, 
            meter_no = excluded.meter_no ,
            meter_brand = excluded.meter_brand, 
            date_installed = excluded.date_installed, 
            image = excluded.image;
        end if;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql; 
    
    
    CREATE TRIGGER change_meter_trigger
                   AFTER UPDATE
                   ON technical_dep.change_meter
                   FOR EACH ROW EXECUTE FUNCTION technical_dep.change_meter_trigger_func();
    """
    )
    
    # TRIGGER FOR SERVICE DROP
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
    # NEW CONNECTION --------------------------------------------------------------------------
    op.add_column(
        "new_connection",
        sa.Column(
            "is_reported",
            sa.Boolean(),
            nullable=True,
            server_default=sa.false()
        ),
        schema="technical_dep"
    )
    op.add_column(
        "new_connection",
        sa.Column(
            "datetime_reported",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        schema="technical_dep",
    )
    
    # TRIGGER FOR NEW_CONNECTION
    op.execute("""
               CREATE OR REPLACE FUNCTION technical_dep.new_connection_trigger_func()
               RETURNS TRIGGER AS $$
               BEGIN
                    -- UPDATE OR INSERT CONSUMER METER
                    if new.is_reported then
                    INSERT INTO gis.consumer_meter
                    (geom, account_no, account_name, meter_no, meter_brand, date_installed, image)
                    SELECT new.geom, new.uuid, new.consumer_name, new.meter_serial_no, new.meter_brand, new.date_accomplished, nci.image
                    FROM technical_dep.new_connection_image as nci
                    WHERE nci.new_connection_id = new.id
                    AND NOT new.is_deleted
                    on conflict (account_no) 
                    do update set 
                    geom = excluded.geom, 
                    account_name = excluded.account_name, 
                    meter_no = excluded.meter_no, 
                    meter_brand = excluded.meter_brand, 
                    date_installed = excluded.date_installed, 
                    image = excluded.image;
                    RETURN NEW;
                    end if;
               END;
               $$ LANGUAGE plpgsql; 
    
    
               CREATE TRIGGER new_connection_trigger
                              AFTER UPDATE
                              ON technical_dep.new_connection
                              FOR EACH ROW EXECUTE FUNCTION technical_dep.new_connection_trigger_func(); 
               """)
    
    
    # CREATING INDEX FOR SEARCHING
    # CONSUMER METER-------------------------------------
    # ACCOUNT NO
    op.drop_index(
        "idx_consumer_meter_account_no_unique",
        table_name="consumer_meter",
        schema="gis",
        if_exists=True,
    )
    
    op.create_index(
        "idx_consumer_meter_meter_no_trgm",
        "consumer_meter",
        ["meter_no"],
        unique=False,
        postgresql_ops={
            "meter_no": "gin_trgm_ops",
        },
        postgresql_using="gin",
        schema="gis",
    )
    
    
    # CHANGE METER
    op.create_index(
        "idx_change_meter_consumer_name_trgm",
        "change_meter",
        ["consumer_name"],
        unique=False,
        postgresql_ops={
            "consumer_name": "gin_trgm_ops",
        },
        postgresql_using="gin",
        schema="technical_dep",
    )

    # NEW CONNECTION
    op.create_index(
        "idx_new_connection_consumer_name_trgm",
        "new_connection",
        ["consumer_name"],
        unique=False,
        postgresql_ops={
            "consumer_name": "gin_trgm_ops",
        },
        postgresql_using="gin",
        schema="technical_dep",
    )
    
    
    # SET TRGM LIMIT
    op.execute(
    """
     ALTER DATABASE biselcowebsite SET pg_trgm.similarity_threshold = 0.2;
    """
    )
    
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
    op.execute(
        """
        DROP TRIGGER IF EXISTS new_connection_trigger ON technical_dep.new_connection;
        DROP FUNCTION IF EXISTS gis.new_connection_trigger_func();
        """
    )
    op.drop_column("new_connection", "is_reported", schema="technical_dep")
    op.drop_column("new_connection", "datetime_reported", schema="technical_dep")
    op.drop_column("change_meter", "is_reported", schema="technical_dep")
    op.drop_column("change_meter", "datetime_reported", schema="technical_dep")
    
    op.drop_index("idx_consumer_meter_account_no_unique", table_name="consumer_meter", schema="gis", if_exists=True)
    op.drop_index("idx_consumer_meter_meter_no_trgm", table_name="consumer_meter", schema="gis")
    op.drop_index("idx_change_meter_consumer_name_trgm", table_name="change_meter", schema="technical_dep")
    op.drop_index("idx_new_connection_consumer_name_trgm", table_name="new_connection", schema="technical_dep")
    
    op.execute(
        """
         ALTER DATABASE biselcowebsite SET pg_trgm.similarity_threshold = 0.3;
        """
        )