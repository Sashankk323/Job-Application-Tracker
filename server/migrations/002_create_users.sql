-- 002_create_users.sql
CREATE TABLE IF NOT EXISTS users (
  id           BIGSERIAL PRIMARY KEY,           -- use BIGINT AUTO_INCREMENT for MySQL
  name         VARCHAR(200) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);
