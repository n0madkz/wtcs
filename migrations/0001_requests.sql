CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  course TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Новая',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);
