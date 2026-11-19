"""capacitor_recloser

Revision ID: df501509bf30
Revises: c74370a04f3b
Create Date: 2026-11-18 08:07:25.436467

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import geoalchemy2

# revision identifiers, used by Alembic.
revision: str = 'df501509bf30'
down_revision: Union[str, Sequence[str], None] = 'c74370a04f3b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "shunt_capacitor_phase_type",
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True
        ),
        sa.Column(
            "description",
            sa.String(),
            nullable=False
        ),
        if_not_exists=True,
        schema="gis"
    )

    op.execute("""INSERT INTO gis.shunt_capacitor_phase_type(description) 
               Values
               ('Single-phase Shunt Capacitor'),
               ('Two (2) single-phase Shunt Capacitors'),
               ('Three-phase Shunt Capacitor'),
               ('Three (3) single-phase Shunt Capacitors');
               """)

    op.create_table(
        "shunt_capacitor",
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True
        ),
        sa.Column(
            "geom",
            geoalchemy2.types.Geometry(
                geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        # CAPACITOR INFORMATION
        sa.Column(
            "shunt_capacitor_id",
            sa.String(),
            nullable=True,
            unique=True
        ),
        sa.Column(
            "bus_connected",
            sa.String(),
            sa.ForeignKey("gis.bus.bus_id", onupdate="CASCADE",
                          ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column(
            "phase_type",
            sa.Integer(),
            sa.ForeignKey("gis.shunt_capacitor_phase_type.id",
                          onupdate="CASCADE", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column(
            "phasing",
            sa.String(),
            nullable=True,
        ),
        sa.Column(
            "voltage_rating_kv",
            sa.Float(precision=2),
            nullable=True,
        ),
        sa.Column(
            "kvar_rating_phase_a",
            sa.Float(precision=2),
            nullable=True,
        ),
        sa.Column(
            "kvar_rating_phase_b",
            sa.Float(precision=2),
            nullable=True,
        ),
        sa.Column(
            "kvar_rating_phase_c",
            sa.Float(precision=2),
            nullable=True,
        ),
        sa.Column(
            "power_loss_watts",
            sa.Float(precision=2),
            nullable=True,
        ),
        sa.Column(
            "village_id",
            sa.Integer(),
            sa.ForeignKey("gis.villages.id", onupdate="CASCADE",
                          ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column(
            "municipality_id",
            sa.Integer(),
            sa.ForeignKey("gis.municipality.id",
                          onupdate="CASCADE", ondelete="CASCADE"),
            nullable=True,

        ),
        # OPERATIONAL ATTRIBUTES
        sa.Column(
            "date_installed",
            sa.Date(),
            nullable=True,
        ),
        sa.Column(
            "date_removed",
            sa.Date(),
            nullable=True,
        ),
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=True,
        ),


        # AUDIT FIELD
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=True,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=True,
            server_onupdate=sa.func.now(),
            onupdate=sa.func.now(),
        ),

        if_not_exists=True,
        schema="gis"
    )

    # TRIGGER FUNCTION
    op.execute("""CREATE OR REPLACE FUNCTION gis.update_insert_shunt_capacitor()
                RETURNS TRIGGER AS $$
                DECLARE
                    connected_bus varchar;
                    capacitor_id varchar;
                    village integer;
                    municipal integer;
                BEGIN
                    SELECT b.bus_id,   b.village_id, b.municipal_id
                    INTO connected_bus,village, municipal
                    FROM gis.bus as b
                    WHERE st_intersects(b.geom, new.geom)
                    AND (b.description not ILIKE '%SECONDARY%' OR b.description IS NULL)
                    LIMIT 1;
                    
                    new.bus_connected = connected_bus;
                    new.village_id = village;
                    new.municipality_id = municipal;
                    return new;
                END;
                $$ LANGUAGE plpgsql;
                
                
                CREATE TRIGGER shunt_capacitor_trigger
                BEFORE INSERT OR UPDATE 
                OF geom
                ON gis.shunt_capacitor
                FOR EACH ROW EXECUTE FUNCTION gis.update_insert_shunt_capacitor();
                """)

    op.create_table(
        "recloser",
        # RECLOSER ATTRIBUTES
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True
        ),
        sa.Column(
            "geom",
            geoalchemy2.types.Geometry(
                geometry_type="POINT", srid=4326),
            nullable=False,
        ),
        # RECLOSER INFORMATION
        sa.Column(
            "recloser_id",
            sa.String(),
            nullable=True,
            unique=True
        ),
        sa.Column("recloser_name", sa.String(), nullable=True),
        sa.Column("manufacturer", sa.String(), nullable=True),
        sa.Column("model", sa.String(), nullable=True),
        sa.Column("serial_number", sa.String(), nullable=True),
        # NETWORK CONNECTIVITY
        sa.Column(
            "bus_connected",
            sa.String(),
            sa.ForeignKey("gis.bus.bus_id", onupdate="CASCADE",
                          ondelete="CASCADE"),
            nullable=True,
        ),

        # Electrical ratings
        sa.Column("nominal_voltage_kv", sa.Float(), nullable=True),
        sa.Column("rated_voltage_kv", sa.Float(), nullable=True),
        sa.Column("rated_current_a", sa.Float(), nullable=True),
        sa.Column("interrupting_capacity_ka", sa.Float(), nullable=True),
        sa.Column("rated_frequency_hz", sa.Float(), nullable=True),


        # Electrical configuration
        sa.Column("phasing", sa.String(), nullable=True),
        sa.Column("installation_type", sa.String(), nullable=True),
        sa.Column("grounding_type", sa.String(), nullable=True),

        # Protection settings
        sa.Column("pickup_current_a", sa.Float(), nullable=True),
        sa.Column("phase_trip_current_a", sa.Float(), nullable=True),
        sa.Column("ground_trip_current_a", sa.Float(), nullable=True),
        sa.Column("fast_operations", sa.Integer(), nullable=True),
        sa.Column("slow_operations", sa.Integer(), nullable=True),
        sa.Column("total_shot_count", sa.Integer(), nullable=True),
        sa.Column("reclosing_interval_s", sa.Float(), nullable=True),

        # OPERATIONAL ATTRIBUTES
        sa.Column("date_installed", sa.Date(), nullable=True),
        sa.Column("date_removed", sa.Date(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),

        sa.Column(
            "village_id",
            sa.Integer(),
            sa.ForeignKey("gis.villages.id", onupdate="CASCADE",
                          ondelete="CASCADE"),
            nullable=True),
        sa.Column(
            "municipality_id",
            sa.Integer(),
            sa.ForeignKey("gis.municipality.id",
                          onupdate="CASCADE", ondelete="CASCADE"),
            nullable=True,
        ),

        # AUDIT FIELD
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=True,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=True,
            onupdate=sa.func.now(),
            server_onupdate=sa.func.now(),
        ),
        if_not_exists=True,
        schema="gis"
    )
    # TRIGGER ON NEW RECLOSER OR MOVED RECLOSER
    op.execute("""CREATE OR REPLACE FUNCTION gis.update_insert_recloser()
                RETURNS TRIGGER AS $$
                DECLARE
                    connected_bus varchar;
                    village integer; 
                    municipal integer;
                BEGIN
                    SELECT b.bus_id, b.village_id, b.municipal_id
                    INTO connected_bus,village, municipal
                    FROM gis.bus as b
                    WHERE st_intersects(b.geom, new.geom)
                    AND (b.description not ILIKE '%SECONDARY%' OR b.description IS NULL)
                    LIMIT 1;
                    
                    new.bus_connected = connected_bus;
                    new.village_id = village;
                    new.municipality_id = municipal;
                    return new;
                END;
                $$ LANGUAGE plpgsql;
                
                
                CREATE TRIGGER recloser_trigger
                BEFORE INSERT OR UPDATE 
                OF geom
                ON gis.recloser
                FOR EACH ROW EXECUTE FUNCTION gis.update_insert_recloser();""")
    # TRIGGER FOR AUDIT UPDATES
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.audit_update()
               RETURNS TRIGGER AS $$
               BEGIN
                    NEW.updated_at = now();
                    RETURN NEW;
               END;
               $$ LANGUAGE plpgsql;
               
               CREATE TRIGGER capacitor_audit_update
               BEFORE UPDATE 
               ON gis.shunt_capacitor
               FOR EACH ROW EXECUTE FUNCTION gis.audit_update();
               
               CREATE TRIGGER recloser_audit_update
               BEFORE UPDATE 
               ON gis.recloser
               FOR EACH ROW EXECUTE FUNCTION gis.audit_update();
               """)
    
def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""DROP TRIGGER recloser_audit_update ON gis.recloser;""")
    op.execute("""DROP TRIGGER  capacitor_audit_update ON gis.shunt_capacitor;""")
    op.execute("""DROP function if exists audit_update();""")
    
    
    
    
    op.execute("""DROP TRIGGER recloser_trigger ON gis.recloser;""")
    op.execute("""DROP FUNCTION gis.update_insert_recloser();""")
    
    op.execute("""DROP TRIGGER shunt_capacitor_trigger ON gis.shunt_capacitor;""")
    op.execute("""DROP FUNCTION gis.update_insert_shunt_capacitor();""")
    op.drop_table("recloser", schema="gis", if_exists=True)
    op.drop_table("shunt_capacitor", schema="gis", if_exists=True)
    op.drop_table("shunt_capacitor_phase_type", schema="gis", if_exists=True)
