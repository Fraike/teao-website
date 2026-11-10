CREATE TABLE IF NOT EXISTS gsc_connection (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  property TEXT NOT NULL,
  refresh_token TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gsc_sync (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  lease TEXT,
  lease_until INTEGER,
  last_finished INTEGER,
  last_error TEXT
);

INSERT OR IGNORE INTO gsc_sync (id) VALUES (1);

CREATE TABLE IF NOT EXISTS gsc_days (
  property TEXT NOT NULL,
  date TEXT NOT NULL,
  cycle TEXT NOT NULL,
  clicks REAL NOT NULL,
  impressions REAL NOT NULL,
  position REAL NOT NULL,
  PRIMARY KEY (property, date)
);

CREATE TABLE IF NOT EXISTS gsc_metrics (
  property TEXT NOT NULL,
  date TEXT NOT NULL,
  report TEXT NOT NULL,
  dimension TEXT NOT NULL,
  second_dimension TEXT NOT NULL,
  clicks REAL NOT NULL,
  impressions REAL NOT NULL,
  position REAL NOT NULL,
  PRIMARY KEY (property, report, date, dimension, second_dimension)
);

CREATE INDEX IF NOT EXISTS gsc_metrics_by_date ON gsc_metrics (property, date);
