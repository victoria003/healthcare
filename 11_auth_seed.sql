-- ============================================================================
-- 11_AUTH_SEED.SQL
-- Seed roles, permissions, role-permissions, and default administrator accounts.
-- ============================================================================

USE DATABASE HOMECARE_DB;
USE SCHEMA CORE;

-- Seed Roles
INSERT INTO CORE.ROLE (role_id, role_name, description) VALUES
  ('role-1', 'PATIENT', 'Patient Customer Role'),
  ('role-2', 'PROFESSIONAL', 'Individual Care Provider Professional Role'),
  ('role-3', 'AGENCY', 'Agency Care Partner Tenant Role'),
  ('role-4', 'ADMIN', 'Platform Operator Administrator Role'),
  ('role-5', 'SUPER_ADMIN', 'Platform Global Controller System Administrator Role');

-- Seed Permissions
INSERT INTO CORE.PERMISSION (permission_id, permission_name, description) VALUES
  ('perm-1', 'Dashboard', 'Access portal dashboards'),
  ('perm-2', 'Bookings', 'View and manage appointment bookings'),
  ('perm-3', 'Patients', 'View and manage patient profiles'),
  ('perm-4', 'Professionals', 'View and manage care professionals roster'),
  ('perm-5', 'Agencies', 'View and manage organization partners'),
  ('perm-6', 'Reports', 'Access analytics reports and metrics data'),
  ('perm-7', 'Settings', 'Access portal configurations'),
  ('perm-8', 'Documents', 'View, upload, and verify compliance files'),
  ('perm-9', 'Notifications', 'View alerts and dispatch notification logs'),
  ('perm-10', 'Payments', 'Access invoices, payouts, and billing ledgers'),
  ('perm-11', 'Profile', 'View and manage personal settings'),
  ('perm-12', 'Users', 'Manage app authentication credentials');

-- Seed Role Permissions (Mapping Permissions to Roles)
-- Patients: Dashboard, Bookings, Profile, Notifications, Documents, Payments
INSERT INTO CORE.ROLE_PERMISSION (role_permission_id, role_id, permission_id) VALUES
  ('rp-pat-1', 'role-1', 'perm-1'),
  ('rp-pat-2', 'role-1', 'perm-2'),
  ('rp-pat-3', 'role-1', 'perm-11'),
  ('rp-pat-4', 'role-1', 'perm-9'),
  ('rp-pat-5', 'role-1', 'perm-8'),
  ('rp-pat-6', 'role-1', 'perm-10');

-- Professionals: Dashboard, Bookings, Profile, Notifications, Documents, Settings
INSERT INTO CORE.ROLE_PERMISSION (role_permission_id, role_id, permission_id) VALUES
  ('rp-pro-1', 'role-2', 'perm-1'),
  ('rp-pro-2', 'role-2', 'perm-2'),
  ('rp-pro-3', 'role-2', 'perm-11'),
  ('rp-pro-4', 'role-2', 'perm-9'),
  ('rp-pro-5', 'role-2', 'perm-8'),
  ('rp-pro-6', 'role-2', 'perm-7');

-- Agencies: Dashboard, Bookings, Patients, Professionals, Profile, Notifications, Documents, Reports, Payments, Settings
INSERT INTO CORE.ROLE_PERMISSION (role_permission_id, role_id, permission_id) VALUES
  ('rp-age-1', 'role-3', 'perm-1'),
  ('rp-age-2', 'role-3', 'perm-2'),
  ('rp-age-3', 'role-3', 'perm-3'),
  ('rp-age-4', 'role-3', 'perm-4'),
  ('rp-age-5', 'role-3', 'perm-11'),
  ('rp-age-6', 'role-3', 'perm-9'),
  ('rp-age-7', 'role-3', 'perm-8'),
  ('rp-age-8', 'role-3', 'perm-6'),
  ('rp-age-9', 'role-3', 'perm-10'),
  ('rp-age-10', 'role-3', 'perm-7');

-- Admins: All Permissions
INSERT INTO CORE.ROLE_PERMISSION (role_permission_id, role_id, permission_id) VALUES
  ('rp-adm-1', 'role-4', 'perm-1'),
  ('rp-adm-2', 'role-4', 'perm-2'),
  ('rp-adm-3', 'role-4', 'perm-3'),
  ('rp-adm-4', 'role-4', 'perm-4'),
  ('rp-adm-5', 'role-4', 'perm-5'),
  ('rp-adm-6', 'role-4', 'perm-6'),
  ('rp-adm-7', 'role-4', 'perm-7'),
  ('rp-adm-8', 'role-4', 'perm-8'),
  ('rp-adm-9', 'role-4', 'perm-9'),
  ('rp-adm-10', 'role-4', 'perm-10'),
  ('rp-adm-11', 'role-4', 'perm-11'),
  ('rp-adm-12', 'role-4', 'perm-12');

-- Super Admins: All Permissions
INSERT INTO CORE.ROLE_PERMISSION (role_permission_id, role_id, permission_id) VALUES
  ('rp-sad-1', 'role-5', 'perm-1'),
  ('rp-sad-2', 'role-5', 'perm-2'),
  ('rp-sad-3', 'role-5', 'perm-3'),
  ('rp-sad-4', 'role-5', 'perm-4'),
  ('rp-sad-5', 'role-5', 'perm-5'),
  ('rp-sad-6', 'role-5', 'perm-6'),
  ('rp-sad-7', 'role-5', 'perm-7'),
  ('rp-sad-8', 'role-5', 'perm-8'),
  ('rp-sad-9', 'role-5', 'perm-9'),
  ('rp-sad-10', 'role-5', 'perm-10'),
  ('rp-sad-11', 'role-5', 'perm-11'),
  ('rp-sad-12', 'role-5', 'perm-12');

-- Seed default Super Admin account (passwordHash matches encrypted 'password123' with 12 rounds)
INSERT INTO CORE.APP_USER (user_id, first_name, last_name, email, phone, password_hash, status) VALUES
  ('u-admin-1', 'Admin', 'Master', 'admin@homecare.in', '+91 99999 99999', '$2a$12$R.S4oO8w7L3gUexf7q2L/e2qU9xQnU/b08XpU3Vb1Yp1L5Zp1UeXy', 'active');

-- Map user u-admin-1 to SUPER_ADMIN role
INSERT INTO CORE.USER_ROLE (user_role_id, user_id, role_id) VALUES
  ('ur-admin-1', 'u-admin-1', 'role-5');
