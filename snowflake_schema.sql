-- ============================================================================
-- HOMECARE MARKETPLACE SAAS - SNOWFLAKE DATABASE DDL SCHEMA
-- ============================================================================
-- Enterprise Multi-Tenant Schema for Patients, Agencies, Staff, and Bookings
-- Optimized for Snowflake Warehouses, Clustering, Tasks, Streams, and Procedures.
-- ============================================================================

-- Create Warehouse if not exists
CREATE WAREHOUSE IF NOT EXISTS HOMECARE_WH
  WITH WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE
  COMMENT = 'Warehouse for HomeCare Marketplace SaaS analytical and operational queries';

-- Create Database
CREATE DATABASE IF NOT EXISTS HOMECARE_DB;
USE DATABASE HOMECARE_DB;

-- Create Schemas for Multi-Tenant Partitioning
CREATE SCHEMA IF NOT EXISTS CORE;
CREATE SCHEMA IF NOT EXISTS ANALYTICS;
CREATE SCHEMA IF NOT EXISTS STAGING;

USE SCHEMA CORE;

-- ============================================================================
-- 1. CORE OPERATIONAL TABLES
-- ============================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS CORE.USERS (
  user_id VARCHAR(50) NOT NULL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  role VARCHAR(30) NOT NULL, -- 'Patient', 'Family Member', 'Agency Admin', 'Nurse', 'Caregiver', 'Physiotherapist', 'Doctor', 'Platform Admin'
  avatar_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'suspended', 'pending'
  otp_secret VARCHAR(100),
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
);

-- Agencies Table (Tenants)
CREATE TABLE IF NOT EXISTS CORE.AGENCIES (
  agency_id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  registration_number VARCHAR(100) UNIQUE NOT NULL,
  gst_number VARCHAR(15) UNIQUE,
  pan_number VARCHAR(10) UNIQUE,
  owner_name VARCHAR(150) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'suspended', 'rejected'
  bank_holder VARCHAR(150),
  bank_account VARCHAR(30),
  bank_ifsc VARCHAR(11),
  bank_name VARCHAR(100),
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
) CLUSTER BY (state, city);

-- Staff Profiles Table
CREATE TABLE IF NOT EXISTS CORE.STAFF_PROFILES (
  staff_id VARCHAR(50) NOT NULL PRIMARY KEY REFERENCES CORE.USERS(user_id),
  agency_id VARCHAR(50) NOT NULL REFERENCES CORE.AGENCIES(agency_id),
  skills ARRAY, -- JSON array of specializations
  experience_years INT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.0,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'on-visit'
  latitude DOUBLE,
  longitude DOUBLE,
  selfie_url VARCHAR(500),
  liveness_verified BOOLEAN DEFAULT FALSE,
  face_match_percentage DECIMAL(5,2),
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
) CLUSTER BY (agency_id);

-- Patient Profiles Table
CREATE TABLE IF NOT EXISTS CORE.PATIENT_PROFILES (
  patient_id VARCHAR(50) NOT NULL PRIMARY KEY REFERENCES CORE.USERS(user_id),
  medical_history TEXT,
  allergies ARRAY,
  blood_group VARCHAR(5),
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
);


-- Saved Addresses Table
CREATE TABLE IF NOT EXISTS CORE.SAVED_ADDRESSES (
  address_id VARCHAR(50) NOT NULL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES CORE.USERS(user_id),
  label VARCHAR(50) NOT NULL, -- 'Home', 'Work', 'Parent'
  address_line TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
) CLUSTER BY (user_id);

-- Services Definitions Table
CREATE TABLE IF NOT EXISTS CORE.SERVICES (
  service_id VARCHAR(50) NOT NULL PRIMARY KEY,
  category VARCHAR(50) NOT NULL, -- 'Nursing', 'Caregiver', 'Physiotherapy', 'Doctors', 'Mother & Baby'
  name VARCHAR(150) NOT NULL,
  description TEXT,
  base_price_inr DECIMAL(10,2) NOT NULL,
  billing_unit VARCHAR(20) NOT NULL -- 'hour', 'visit', 'day'
);

-- Bookings Table (The Core Transaction Log)
CREATE TABLE IF NOT EXISTS CORE.BOOKINGS (
  booking_id VARCHAR(50) NOT NULL PRIMARY KEY,
  agency_id VARCHAR(50) NOT NULL REFERENCES CORE.AGENCIES(agency_id),
  patient_id VARCHAR(50) NOT NULL REFERENCES CORE.USERS(user_id),
  family_member_id VARCHAR(50) REFERENCES CORE.FAMILY_MEMBERS(member_id),
  service_category VARCHAR(50) NOT NULL,
  service_name VARCHAR(150) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'in-progress', 'completed', 'rescheduled'
  booking_date DATE NOT NULL,
  time_slot VARCHAR(30) NOT NULL,
  duration_hours INT NOT NULL,
  frequency VARCHAR(20) NOT NULL, -- 'one-time', 'weekly', 'monthly'
  address_line TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(6) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'refunded'
  assigned_staff_id VARCHAR(50) REFERENCES CORE.STAFF_PROFILES(staff_id),
  sys_bp INT,
  dia_bp INT,
  pulse INT,
  temp DECIMAL(4,1),
  spo2 INT,
  visit_notes TEXT,
  selfie_verified BOOLEAN DEFAULT FALSE,
  signature_url VARCHAR(500),
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
) CLUSTER BY (agency_id, booking_date);

-- Verification Documents
CREATE TABLE IF NOT EXISTS CORE.DOCUMENTS (
  document_id VARCHAR(50) NOT NULL PRIMARY KEY,
  owner_id VARCHAR(50) NOT NULL, -- Matches user_id or agency_id
  type VARCHAR(30) NOT NULL, -- 'license', 'gst', 'pan', 'aadhaar', 'degree_cert'
  file_url VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,
  uploaded_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  verified_at TIMESTAMP_TZ
);

-- Inventory Supplies
--CREATE TABLE IF NOT EXISTS CORE.INVENTORY (
  --item_id VARCHAR(50) NOT NULL PRIMARY KEY,
  --agency_id VARCHAR(50) NOT NULL REFERENCES CORE.AGENCIES(agency_id),
  --name VARCHAR(150) NOT NULL,
  --category VARCHAR(30) NOT NULL, -- 'consumable', 'supply', 'equipment'
  --quantity INT NOT NULL DEFAULT 0,
  --min_threshold INT NOT NULL DEFAULT 5,
  --unit VARCHAR(20) NOT NULL,
  --updated_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
--) CLUSTER BY (agency_id);

-- Invoices & Payouts Table
CREATE TABLE IF NOT EXISTS CORE.INVOICES (
  invoice_id VARCHAR(50) NOT NULL PRIMARY KEY,
  booking_id VARCHAR(50) NOT NULL REFERENCES CORE.BOOKINGS(booking_id),
  amount DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'unpaid', -- 'paid', 'unpaid', 'overdue'
  due_date DATE NOT NULL,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
);

-- Emergency SOS Audit Logs
CREATE TABLE IF NOT EXISTS CORE.SOS_ALERTS (
  sos_id VARCHAR(50) NOT NULL PRIMARY KEY,
  booking_id VARCHAR(50) NOT NULL REFERENCES CORE.BOOKINGS(booking_id),
  triggered_by VARCHAR(50) NOT NULL REFERENCES CORE.USERS(user_id),
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'resolved'
  resolved_at TIMESTAMP_TZ,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
);

-- Audit Action Logs (For Security Compliance)
CREATE TABLE IF NOT EXISTS CORE.AUDIT_LOGS (
  log_id INT AUTOINCREMENT NOT NULL PRIMARY KEY,
  actor_id VARCHAR(50) REFERENCES CORE.USERS(user_id),
  action VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
);


-- ============================================================================
-- 2. STREAMS AND CHANGE DATA CAPTURE (CDC)
-- ============================================================================

-- Create a Stream to monitor high-risk SOS alert creations
CREATE OR REPLACE STREAM CORE.SOS_ALERT_STREAM ON TABLE CORE.SOS_ALERTS
  COMMENT = 'Stream logging emergency SOS events for real-time dashboard notifications';


-- ============================================================================
-- 3. MATERIALIZED VIEWS & ANALYTICS
-- ============================================================================

-- Daily/Monthly Revenue Aggregates per Agency
CREATE OR REPLACE MATERIALIZED VIEW ANALYTICS.AGENCY_REVENUE_SUMMARY
  AS
  SELECT
    agency_id,
    DATE_TRUNC('month', booking_date) AS month,
    SUM(IFF(payment_status = 'paid', amount, 0)) AS total_paid_revenue,
    COUNT(booking_id) AS total_bookings,
    COUNT(IFF(status = 'completed', 1, NULL)) AS completed_visits,
    COUNT(IFF(status = 'rejected', 1, NULL)) AS rejected_visits
  FROM CORE.BOOKINGS
  GROUP BY agency_id, month;


-- ============================================================================
-- 4. BUSINESS LOGIC STORED PROCEDURES (SQL SCRIPTING)
-- ============================================================================

-- Procedure to automatically calculate and record commission-adjusted Invoice payouts
CREATE OR REPLACE PROCEDURE CORE.GENERATE_PAYOUT_INVOICE(
    booking_id_in VARCHAR, 
    tax_rate DECIMAL(4,2), 
    commission_rate DECIMAL(4,2)
)
RETURNS VARCHAR
LANGUAGE SQL
AS
$$
DECLARE
  v_amount DECIMAL(10,2);
  v_tax DECIMAL(10,2);
  v_discount DECIMAL(10,2) := 0.0;
  v_total DECIMAL(10,2);
  v_invoice_id VARCHAR;
BEGIN
  -- Get Booking Details
  SELECT amount INTO :v_amount FROM CORE.BOOKINGS WHERE booking_id = :booking_id_in;
  
  -- Calculate Tax and Total
  v_tax := v_amount * tax_rate;
  v_total := v_amount + v_tax - v_discount;
  v_invoice_id := 'INV-' || UUID_STRING();

  -- Insert into Invoices
  INSERT INTO CORE.INVOICES (invoice_id, booking_id, amount, tax, discount, total_amount, status, due_date, created_at)
  VALUES (:v_invoice_id, :booking_id_in, :v_amount, :v_tax, :v_discount, :v_total, 'unpaid', DATEADD('day', 7, CURRENT_DATE()), CURRENT_TIMESTAMP());

  RETURN 'Invoice successfully generated: ' || v_invoice_id;
END;
$$;


-- ============================================================================
-- 5. TASK SCHEDULERS (CRON SCHEDULED ENGINE)
-- ============================================================================

-- Automates the check for Overdue Invoices every midnight
CREATE OR REPLACE TASK CORE.CHECK_OVERDUE_INVOICES_TASK
  WAREHOUSE = HOMECARE_WH
  SCHEDULE = 'USING CRON 0 0 * * * UTC' -- Everyday at midnight
AS
  UPDATE CORE.INVOICES
  SET status = 'overdue'
  WHERE status = 'unpaid' AND due_date < CURRENT_DATE();

-- Task initially suspended by default (Standard Snowflake Security)
ALTER TASK CORE.CHECK_OVERDUE_INVOICES_TASK RESUME;
