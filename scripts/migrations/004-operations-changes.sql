CREATE TABLE IF NOT EXISTS website_operations_changes (
  id INTEGER PRIMARY KEY,
  changed_on TEXT NOT NULL,
  page TEXT NOT NULL,
  summary TEXT NOT NULL
);
