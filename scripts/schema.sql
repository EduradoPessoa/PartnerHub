-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- We use text IDs in mock (e.g. 'admin1'), but could use UUID
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  location TEXT,
  phone TEXT,
  leader_id TEXT,
  pj_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  executive_id TEXT NOT NULL REFERENCES users(id),
  company_name TEXT NOT NULL,
  cnpj TEXT,
  contact_name TEXT,
  contact_email TEXT,
  project_type TEXT,
  estimated_value NUMERIC,
  status TEXT NOT NULL,
  temperature TEXT,
  notes TEXT,
  engineering_data JSONB, -- Stores technical scope, approval status, etc.
  files JSONB, -- Array of file objects
  payment_conditions TEXT,
  project_start_date TIMESTAMP,
  project_deadline TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- COMMISSIONS TABLE
CREATE TABLE IF NOT EXISTS commissions (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'CLOSING' or 'SUCCESS_FEE'
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  due_date TIMESTAMP,
  invoice_url TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TIMESHEET TABLE
CREATE TABLE IF NOT EXISTS timesheet (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  opportunity_id TEXT REFERENCES opportunities(id),
  date DATE NOT NULL,
  hours NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_opportunities_executive ON opportunities(executive_id);
CREATE INDEX idx_commissions_opportunity ON commissions(opportunity_id);
CREATE INDEX idx_timesheet_user ON timesheet(user_id);
