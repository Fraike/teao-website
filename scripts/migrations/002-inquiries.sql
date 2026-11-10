ALTER TABLE contact_inquiries ADD COLUMN submission_key TEXT;
ALTER TABLE contact_inquiries ADD COLUMN attribution TEXT;
ALTER TABLE contact_inquiries ADD COLUMN quality TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE contact_inquiries ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE contact_inquiries ADD COLUMN first_human_reply_at INTEGER;
CREATE UNIQUE INDEX contact_inquiries_submission_key_unique ON contact_inquiries(submission_key);

CREATE TABLE inquiry_drafts (
  inquiry_id INTEGER PRIMARY KEY REFERENCES contact_inquiries(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sources TEXT NOT NULL DEFAULT '[]',
  version TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE inquiry_mail_jobs (
  id TEXT PRIMARY KEY NOT NULL,
  inquiry_id INTEGER NOT NULL REFERENCES contact_inquiries(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payload TEXT NOT NULL,
  approved_by TEXT,
  provider_id TEXT UNIQUE,
  provider_event_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  first_attempt_at INTEGER,
  next_attempt_at INTEGER NOT NULL,
  lease_until INTEGER,
  sent_at INTEGER,
  created_at INTEGER NOT NULL,
  last_error TEXT
);

CREATE INDEX inquiry_mail_jobs_schedule ON inquiry_mail_jobs(status, next_attempt_at);
CREATE INDEX inquiry_mail_jobs_inquiry ON inquiry_mail_jobs(inquiry_id);
