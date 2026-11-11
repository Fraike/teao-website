CREATE TABLE IF NOT EXISTS website_operations_state (
  name TEXT PRIMARY KEY,
  last_success_at INTEGER,
  last_alert_key TEXT,
  last_error TEXT
);
CREATE INDEX IF NOT EXISTS analytics_events_event_created ON analytics_events (event, created_at);
CREATE INDEX IF NOT EXISTS contact_inquiries_created ON contact_inquiries (created_at);
