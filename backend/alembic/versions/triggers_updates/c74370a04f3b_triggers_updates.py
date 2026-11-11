"""triggers updates

Revision ID: c74370a04f3b
Revises: a22a31663b18
Create Date: 2026-11-11 10:09:57.118719

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c74370a04f3b'
down_revision: Union[str, Sequence[str], None] = 'a22a31663b18'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.distribution_transformer_trigger_after_func()
               RETURNS TRIGGER AS $$
               BEGIN 
               UPDATE gis.bus as bus
                    SET is_active = new.is_active
                    WHERE bus.bus_id = new.to_secondary_bus_id
                    AND bus.is_active is distinct from new.is_active;
                    
              
                    
                    -- UPDATE TRANSFORMER LINE ACTIVE STATUS AND PHASING
                    UPDATE gis.secondary_lines as sl
                    set is_active = new.is_active,
                    phasing = new.secondary_phasing
                    where sl.transformer_id = new.transformer_id
                    AND (
                        sl.phasing is distinct from new.secondary_phasing or
                        sl.is_active is distinct from new.is_active);
                    
                
                    UPDATE gis.transformer_linebushing as tl
                    SET is_active = new.is_active
                    WHERE tl.transformer_id = new.transformer_id
                    AND tl.is_active is distinct from new.is_active;
                    
               RETURN NEW;
               END
               $$ LANGUAGE plpgsql;
               """
    )
    
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.secondary_lines_trigger_after_func()
               RETURNS TRIGGER AS $$
               BEGIN
                 -- UPDATE GIS BUS OR NODE
                    UPDATE gis.bus as b
                    SET 
                    is_active = new.is_active
                    WHERE b.bus_id = new.to_bus_id
                    AND b.is_active is DISTINCT FROM new.is_active;
                    
                    -- UPDATE GIS BUS OR NODE feeder and SUBSTATION ID
                    UPDATE gis.bus as b
                    SET 
                    substation_id = fb.substation_id,
                    feeder_id = fb.feeder_id
                    FROM gis.bus as fb 
                    where fb.bus_id = new.from_bus_id
                    AND b.bus_id = new.to_bus_id
                    AND (b.substation_id is DISTINCT FROM fb.substation_id or b.feeder_id is DISTINCT FROM fb.feeder_id);
                    
                    -- UPDATE GIS SERVICE SECONDARY SERVICE DROP
                    UPDATE gis.service_drop as sd
                    SET phasing = new.phasing
                    WHERE 
                    (sd.from_bus_id = new.from_bus_id or sd.from_bus_id = new.to_bus_id)
                    AND sd.phasing is DISTINCT from new.phasing;
                RETURN NEW;
               END
               $$ LANGUAGE plpgsql;
               """)
    op.execute(
    """DROP TRIGGER IF EXISTS secondary_lines_trigger_after
        ON gis.secondary_lines;

        CREATE TRIGGER secondary_lines_trigger_after
        AFTER INSERT OR UPDATE OF is_active, phasing, from_bus_id, to_bus_id
        ON gis.secondary_lines
        FOR EACH ROW
        EXECUTE FUNCTION gis.secondary_lines_trigger_after_func();
    """
    )
    
    op.execute(
        """DROP TRIGGER IF EXISTS secondary_lines_trigger
        ON gis.secondary_lines;
        
        CREATE TRIGGER secondary_lines_trigger
        BEFORE INSERT OR UPDATE of geom
        ON gis.secondary_lines
        FOR EACH ROW
        EXECUTE FUNCTION gis.secondary_lines_trigger_func();
        """
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.distribution_transformer_trigger_after_func()
                RETURNS TRIGGER AS $$
                	BEGIN
	                    UPDATE gis.bus as bus
	                    SET is_active = new.is_active
	                    WHERE bus.bus_id = new.to_secondary_bus_id
	                    AND bus.is_active is distinct from new.is_active;
	                    
	                    UPDATE gis.secondary_lines as sl
	                    set is_active = new.is_active
	                    where sl.transformer_id = new.transformer_id
	                    AND sl.is_active is distinct from new.is_active;
	                    
	                    UPDATE gis.transformer_linebushing as tl
	                    SET is_active = new.is_active
	                    WHERE tl.transformer_id = new.transformer_id
	                    AND tl.is_active is distinct from new.is_active;
	               RETURN NEW;
	               END
                   $$ LANGUAGE plpgsql;
        """
    )
    op.execute("""
               CREATE OR REPLACE FUNCTION gis.secondary_lines_trigger_after_func()
               RETURNS TRIGGER AS $$
               begin
                    -- UPDATE GIS BUS OR NODE
                    UPDATE gis.bus as b
                    SET 
                    is_active = new.is_active
                    WHERE b.bus_id = new.to_bus_id
                    AND b.is_active is DISTINCT FROM new.is_active;
                    
                    
                    UPDATE gis.bus as b
                    SET 
                    substation_id = fb.substation_id,
                    feeder_id = fb.feeder_id
                    FROM gis.bus as fb 
                    where fb.bus_id = new.from_bus_id
                    AND b.bus_id = new.to_bus_id
                    AND (b.substation_id is DISTINCT FROM fb.substation_id or b.feeder_id is DISTINCT FROM fb.feeder_id);
                    
                RETURN NEW;
               end
               $$ LANGUAGE plpgsql;
               """)
    op.execute(
    """DROP TRIGGER IF EXISTS secondary_lines_trigger_after
        ON gis.secondary_lines;

        CREATE TRIGGER secondary_lines_trigger_after
        AFTER INSERT OR UPDATE 
        ON gis.secondary_lines
        FOR EACH ROW
        EXECUTE FUNCTION gis.secondary_lines_trigger_after_func();
    """
    )
    
    
    op.execute(
            """DROP TRIGGER IF EXISTS secondary_lines_trigger
            ON gis.secondary_lines;
            
            CREATE TRIGGER secondary_lines_trigger
            BEFORE INSERT OR UPDATE 
            ON gis.secondary_lines
            FOR EACH ROW
            EXECUTE FUNCTION gis.secondary_lines_trigger_func();
            """
        )