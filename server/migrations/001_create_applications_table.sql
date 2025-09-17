CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  application_date DATE,
  status VARCHAR(50) DEFAULT 'Applied',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);
