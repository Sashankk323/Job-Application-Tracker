CREATE TABLE IF NOT EXISTS jobs (
  id          BIGSERIAL PRIMARY KEY,           -- MySQL: BIGINT AUTO_INCREMENT PRIMARY KEY
  user_id     BIGINT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  company     VARCHAR(200) NOT NULL,
  status      VARCHAR(40)  NOT NULL DEFAULT 'Applied',
  link        TEXT,
  source      VARCHAR(120),
  deadline    TIMESTAMP NULL,                  -- MySQL: DATETIME NULL
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
