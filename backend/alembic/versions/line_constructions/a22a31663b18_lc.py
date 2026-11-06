"""lc

Revision ID: a22a31663b18
Revises: cm_nc_triggers
Create Date: 2026-11-04 10:50:55.753143

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a22a31663b18'
down_revision: Union[str, Sequence[str], None] = 'cm_nc_triggers'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("CREATE schema if not exists construction;")

    # CONSTRUCTION TABLE MIGRATION
    op.execute(
        """
        ALTER TABLE technical_dep.construction
        SET schema construction;
        """
    )

    # LINE CONSTRUCTION MIGRATION
    op.execute(
        """
        ALTER TABLE technical_dep.line_construction
        SET schema  construction;
        """
    )
    op.execute(
        """
        ALTER TABLE technical_dep.line_construction_image
        SET schema  construction;
        """
    )

    # DISTRIBUTION TRANSFORMER TABLE MIGRATION
    op.execute(
        """
     ALTER TABLE technical_dep.transformer_installation
     SET schema construction;
    """
    )
    op.execute(
        """
        ALTER TABLE technical_dep.transformer_installation_image
        SET schema construction;
        """
    )

    # MAN POWER STATUS
    op.create_table(
        "attendance_status",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("status", sa.String(), nullable=False, unique=True),
        if_not_exists=True,
        schema="construction",
    )
    op.execute(
        """
        INSERT INTO construction.attendance_status (status)
        VALUES ('Present'), ('Absent'), ('On Leave'), ('Trainings / Seminars'), ('Other')
        ON CONFLICT (status) DO NOTHING;
        """
    )
    # MAN POWER STATUS REPORT
    op.create_table(
        "man_power_status",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("construction_id", sa.Integer(), sa.ForeignKey(
            "construction.construction.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=True),
        sa.Column("assigned_personnel", sa.String(), nullable=True),
        sa.Column("attendance_status_id", sa.Integer(), sa.ForeignKey(
            "construction.attendance_status.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=True),
        sa.Column("reason_of_absence", sa.String(), nullable=True),
        if_not_exists=True,
        schema="construction",
    )
    # VEHICLE REPORT
    op.create_table(
        "vehicle_report",
        sa.Column("id", sa.Integer(), nullable=False, primary_key=True),
        sa.Column("construction_id", sa.Integer(), sa.ForeignKey(
            "construction.construction.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=True),
        sa.Column("vehicle_name", sa.String(), nullable=True),
        sa.Column("mileage_start", sa.Float(), nullable=True),
        sa.Column("mileage_end", sa.Float(), nullable=True),
        sa.Column("total_mileage", sa.Float(),  sa.Computed(
            "mileage_end - mileage_start", persisted=True), nullable=True),
        if_not_exists=True,
        schema="construction",
    )
    
    

    # ADDITIONAL COLUMN FOR LINE CONSTRUCTION
    op.add_column(
        "line_construction",
        sa.Column("date", sa.Date(), nullable=True),
        schema="construction"
    )
    op.add_column(
        "line_construction",
        sa.Column("pct_acc", sa.Float(), nullable=True),
        schema="construction"
    )
    op.create_check_constraint(
        "construction_pct_acc_check",
        "line_construction",
        "pct_acc >= 0 AND pct_acc <= 100",
        schema="construction"
    )

    # ADDITIONAL COLUMN FOR TRANSFORMER INSTALLATION
    op.add_column(
        "transformer_installation",
        sa.Column("date", sa.Date(), nullable=True),
        schema="construction"
    )
    op.add_column(
        "transformer_installation",
        sa.Column("pct_acc", sa.Float(), nullable=True),
        schema="construction"
    )
    op.create_check_constraint(
        "construction_pct_acc_check",
        "transformer_installation",
        "pct_acc >= 0 AND pct_acc <= 100",
        schema="construction"
    )
    

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("construction_pct_acc_check",
                       "construction", schema="construction")
    op.drop_column("construction", "pct_acc", schema="construction")

    op.drop_table("vehicle_report", schema="construction", if_exists=True)
    op.drop_table("man_power_status", schema="construction", if_exists=True)
    op.drop_table("attendance_status", schema="construction", if_exists=True)

    # DISTRIBUTION TRANSFORMER TABLE MIGRATION
    op.execute(
        """
        ALTER TABLE construction.transformer_installation
        SET schema technical_dep;
        """
    )
    op.execute(
        """
        ALTER TABLE construction.transformer_installation_image
        SET schema technical_dep;
        """
    )

    # LINE CONSTRUCTION MIGRATION
    op.execute(
        """
        ALTER TABLE construction.line_construction
        SET schema technical_dep;
        """
    )
    op.execute(
        """
        ALTER TABLE construction.line_construction_image
        SET schema technical_dep;
        """
    )

    op.execute(
        """
        ALTER TABLE construction.construction
        SET schema technical_dep;
        """
    )
    op.execute("DROP SCHEMA IF EXISTS construction;")
