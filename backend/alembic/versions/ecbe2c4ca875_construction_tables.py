"""construction tables

Revision ID: ecbe2c4ca875
Revises: 49b356a2d0a5
Create Date: 2026-08-17 09:46:09.949115

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from geoalchemy2.types import Geometry

# revision identifiers, used by Alembic.
revision: str = 'ecbe2c4ca875'
down_revision: Union[str, Sequence[str], None] = '49b356a2d0a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    ADD ADDITINAL TABLE FOR TECHNICAL DEPARTMENT SCHEMA
    - CONSTRUCTION (TABLE) : construction table includes the activity and the datetime of activity. 
    - LINE CONSTRUCTION (TABLE) : A constuction activity that performs a Line extension or New  primary, secondary or underbuilt lines.
    - TRANSFORMER INSTALLATION : A construction activity that performs a transformer installation.
    - REHABILITATION : A construction activity that performs a rehabilitation of a line.
    """
    # CONSTRUCTION TABLE
    op.create_table(
        "construction",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("form_id",sa.Integer(),sa.ForeignKey("form.id", ondelete="CASCADE", onupdate="CASCADE"),nullable=True, server_default="2"),
        sa.Column("activity", sa.Text(), nullable=False),
        sa.Column("timestamped", sa.DateTime(timezone=True), nullable=True, server_default=sa.func.now()),
    
        # SCHEMA
        schema="technical_dep",
    )
    
    # LINE CONSTRUCTION 
    op.create_table(
        "line_construction",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("construction_id", sa.Integer(), 
                  sa.ForeignKey("technical_dep.construction.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False),
        sa.Column("type", sa.Text(), nullable=True),
        sa.Column("line_type", sa.Enum("primary", "secondary", "underbuilt", name='line_type', create_type=False), nullable=False),
        sa.Column("phasing", sa.Text(), nullable=False),
        sa.Column("pole_assembly", sa.Text(), nullable=False),
        sa.Column("conductor", sa.Integer(), sa.ForeignKey("gis.conductor_wires.id"), nullable=False),
        sa.Column("neutral", sa.Integer(), sa.ForeignKey("gis.neutral_concentric_cable.id"),nullable=True),
        sa.Column("image", sa.Text(), nullable=True),
        sa.Column("geometry", Geometry(geometry_type="POINT", srid=4326, spatial_index=True), nullable=False),
        
        schema="technical_dep"
    )
    
    # TRANSFORMER INSTALLATION
    op.create_table(
        "transformer_installation",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("construction_id", sa.Integer(),sa.ForeignKey("technical_dep.construction.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False),
        sa.Column("type", sa.Text(), nullable=True),
        sa.Column("use_type", sa.Enum("sole", "distribution", name="use_type", create_type=False), nullable=False),
        sa.Column("phasing", sa.Text(), nullable=False),
        sa.Column("kva_rating", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("image", sa.Text(), nullable=True),
        sa.Column("geometry", Geometry(geometry_type="POINT", srid=4326, spatial_index=True), nullable=False),
        
        schema="technical_dep"
    )
    # ADD COLUMN FOR CONDUCTOR AND NEUTRAL WIRE
    op.add_column("conductor_wires", sa.Column("name", sa.Text(), nullable=False), schema="gis", if_not_exists=True)
    op.add_column("conductor_wires", sa.Column("remarks", sa.Text(), nullable=True), schema="gis", if_not_exists=True)
    op.add_column("neutral_concentric_cable", sa.Column("name", sa.Text(), nullable=False), schema="gis", if_not_exists=True)
    op.add_column("neutral_concentric_cable", sa.Column("remarks", sa.Text(), nullable=True), schema="gis", if_not_exists=True)
    

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("transformer_installation", schema="technical_dep", if_exists=True)
    op.drop_table("line_construction", schema="technical_dep", if_exists=True)
    op.drop_table("construction", schema="technical_dep", if_exists=True)
    
    
    
    op.execute("DROP TYPE IF EXISTS use_type")
    op.execute("DROP TYPE IF EXISTS line_type")
    
    
    # addition column
    op.drop_column("conductor_wires", "name", schema="gis", if_exists=True)
    op.drop_column("conductor_wires", "remarks", schema="gis", if_exists=True)
    op.drop_column("neutral_concentric_cable", "name", schema="gis", if_exists=True)
    op.drop_column("neutral_concentric_cable", "remarks", schema="gis", if_exists=True)
    
    