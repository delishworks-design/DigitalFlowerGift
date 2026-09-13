-- Digital Flower Gift Database Schema

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_token TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  giver_name TEXT,
  flower_type TEXT NOT NULL CHECK (flower_type IN ('rose', 'sunflower', 'tulip', 'daisy', 'lavender')),
  flower_name TEXT NOT NULL,
  personal_message TEXT NOT NULL,
  bloom_message TEXT NOT NULL,
  start_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Index for token lookup
CREATE INDEX IF NOT EXISTS idx_gifts_public_token ON gifts(public_token);

-- Care events table
CREATE TABLE IF NOT EXISTS care_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  care_date DATE NOT NULL,
  care_type TEXT NOT NULL CHECK (care_type IN ('water', 'sunlight', 'love')),
  xp_awarded INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gift_id, care_date, care_type)
);

-- Index for care event lookups
CREATE INDEX IF NOT EXISTS idx_care_events_gift_id ON care_events(gift_id);
CREATE INDEX IF NOT EXISTS idx_care_events_gift_date ON care_events(gift_id, care_date);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  reward_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gift_id, reward_key)
);

-- Index for reward lookups
CREATE INDEX IF NOT EXISTS idx_rewards_gift_id ON rewards(gift_id);

-- Row Level Security (RLS)
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for server-side operations)
CREATE POLICY "Service role can do everything on gifts"
  ON gifts FOR ALL
  USING (true);

CREATE POLICY "Service role can do everything on care_events"
  ON care_events FOR ALL
  USING (true);

CREATE POLICY "Service role can do everything on rewards"
  ON rewards FOR ALL
  USING (true);
