"""initial values for permission, roles, forms, complaints name

Revision ID: bfa63f46ad01
Revises: 73c00c5bbaac
Create Date: 2026-02-26 21:49:34.863044

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bfa63f46ad01'
down_revision: Union[str, Sequence[str], None] = '73c00c5bbaac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ADD ROLES
    op.execute(
        """
    INSERT INTO roles (name)
    VALUES ('admin'), ('mco')
    ON CONFLICT (name) DO NOTHING;
    """)

    # ADD PERMISSION
    op.execute(
        """
    INSERT INTO permissions (code)
    VALUES ('view:all'), ('create:all'), ('delete:all'), ('post:all'),
    ('view:news'), ('create:profile'), ('post:complaint'), ('delete:complaint')
    ON CONFLICT (code) DO NOTHING;
    """
    )

    # ADD ROLE AND PERMISSION RELATIONSHIPS
    op.execute(
        """
        INSERT INTO roles_permission (roles_id, perm_id)
        SELECT r.id, p.id 
        FROM ( VALUES 
        ('admin','view:all'),
        ('admin','create:all'),
        ('admin','delete:all'),
        ('admin','post:all'),
        ('mco','view:news'),
        ('mco','create:profile'),
        ('mco','post:complaint'),
        ('mco','delete:complaint')
        ) AS t (role, permission)
        JOIN roles r ON r.name = t.role
        JOIN permissions p ON p.code = t.permission;
        """
    )

    # ADD COMPLAINTS NAME
    op.execute(
        """
        INSERT INTO complaints_status_name (status_name, description)
        VALUES 
        ('Received', 'We Received your Complaints. Thank you for Submitting.'),
        ('Pending', 'Your Complaints is in Pending State. We will update you if we have any update. Please Stand by.'),
        ('Working', 'We are working on your Complaints. Please wait for a while and we will do our best to solve it in short time.'),
        ('Complete', 'We have completed your Complaints. Thank you for your patience.')
        ON CONFLICT (status_name) DO UPDATE
        SET description = excluded.description;
        """
    )

    # ADD DEPARMENTS

    op.execute(
        """
        INSERT INTO departments (name, description)
        VALUES 
        ('OGM', 'Office of The General Manager'),
        ('FSD' , 'Financial Services Department'),
        ('ISD', 'Information Services Department'),
        ('TSD', 'Technical Services Department'),
        ('ASD', 'Area Services Department')
        ON CONFLICT (name) DO UPDATE
        SET description = excluded.description;
        """
    )

    # ADD FORMS
    op.execute(
        """
        INSERT INTO FORM(department_id, form_name, form_description)
        SELECT dep.id, t.form_name, t.form_description
        FROM (
            VALUES
                ('TSD', 'New Connection', 'Form for New Connection Accomplishments, Upload Photo Of the Current or New Meter Including Location Pinned on the map and Needed data for Reporting and Insights.'),
                ('TSD', 'Change Meter', 'Form for Change Meter Accomplishments, Upload Photo Of the Current or New Meter Including Location Pinned on then map and Needed data for Reporting and Insights.'),
                ('TSD', 'Construction Daily', 'Form for Construction Accomplishments Where They can Upload Photos of Their Works.'),
                ('TSD', 'Maintenance Daily', 'Form for Maintenance Accomplishments Where They can Upload Photos of Their Works Daily.')
        ) AS t(dep_name, form_name, form_description)
        JOIN departments dep ON dep.name = t.dep_name;
        """
    )

def downgrade() -> None:
    """Downgrade schema."""
    
    op.execute("DELETE FROM roles WHERE name IN ('admin', 'mco');")
    op.execute("DELETE FROM roles_permission WHERE roles_id IN (SELECT id FROM roles WHERE name IN ('admin', 'mco'));")
    op.execute("DELETE FROM permissions WHERE code IN ('view:all', 'create:all', 'delete:all', 'post:all', 'view:news', 'create:profile', 'post:complaint', 'delete:complaint');")
    op.execute("DELETE FROM complaints_status_name WHERE status_name IN ('Received', 'Pending', 'Working', 'Complete');")
    op.execute("DELETE FROM departments WHERE name IN ('OGM', 'FSD', 'ISD', 'TSD', 'ASD');")
    op.execute("DELETE FROM FORM WHERE form_name IN ('New Connection', 'Change Meter', 'Construction Daily', 'Maintenance Daily');")
    
    op.execute("ALTER SEQUENCE roles_id_seq RESTART WITH 1;")
    op.execute("ALTER SEQUENCE permissions_id_seq RESTART WITH 1;")
    op.execute("ALTER SEQUENCE complaints_status_name_id_seq RESTART WITH 1;")
    op.execute("ALTER SEQUENCE departments_id_seq RESTART WITH 1;")
    op.execute("ALTER SEQUENCE form_id_seq RESTART WITH 1;")
