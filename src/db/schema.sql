CREATE TABLE IF NOT EXISTS categories (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6b7280'
);

CREATE TABLE IF NOT EXISTS expenses (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  spent_on    DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_spent_on ON expenses (spent_on);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (category_id);

INSERT INTO categories (name, color) VALUES
  ('Groceries',     '#2a78d6'),
  ('Rent',          '#eb6834'),
  ('Utilities',     '#1baf7a'),
  ('Transport',     '#eda100'),
  ('Dining Out',    '#e87ba4'),
  ('Entertainment', '#008300'),
  ('Health',        '#4a3aa7'),
  ('Shopping',      '#e34948'),
  ('Travel',        '#256abf'),
  ('Other',         '#8d8b85')
ON CONFLICT (name) DO NOTHING;
