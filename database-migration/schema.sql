-- CABC-T Website Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- ANNOUNCEMENTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language VARCHAR(2) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'tc', 'sc')),
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Multi-language visibility (which language pages show this announcement)
  visibility_language TEXT[] DEFAULT ARRAY['en', 'tc', 'sc'],
  
  -- Date-based publishing (show between start_date and end_date)
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE, -- null = show forever
  
  -- Attachments
  image_url TEXT,
  pdf_url TEXT
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read announcements
CREATE POLICY "announcements_public_read" ON announcements
  FOR SELECT USING (true);

-- Policy: Only authenticated users can insert/update their own announcements
CREATE POLICY "announcements_auth_insert" ON announcements
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "announcements_auth_update" ON announcements
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Policy: Only authenticated users can delete
CREATE POLICY "announcements_auth_delete" ON announcements
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- =====================
-- SERMONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  youtube_url TEXT NOT NULL,
  language VARCHAR(2) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'tc', 'sc', 'all')),
  preacher TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read sermons
CREATE POLICY "sermons_public_read" ON sermons
  FOR SELECT USING (true);

-- Policy: Only authenticated users can insert/update/delete
CREATE POLICY "sermons_auth_insert" ON sermons
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "sermons_auth_update" ON sermons
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "sermons_auth_delete" ON sermons
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================
CREATE INDEX IF NOT EXISTS idx_announcements_language ON announcements(language);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_start_date ON announcements(start_date);
CREATE INDEX IF NOT EXISTS idx_announcements_end_date ON announcements(end_date);
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_language ON sermons(language);

-- =====================
-- SAMPLE DATA
-- =====================

-- Sample announcements (English)
INSERT INTO announcements (title, content, language, priority) VALUES
(
  'Welcome to CABC Thornleigh',
  'Welcome to Chinese Australian Baptist Church - Thornleigh. We are a multilingual church serving the Chinese-Australian community in Sydney. Join us this Sunday!',
  'en',
  1
),
(
  '歡迎來到華澳浸信會展信堂',
  '歡迎來到華澳浸信會展信堂。我們是一個服務悉尼華人社區的多語言教會。歡迎本主日参加崇拜！',
  'tc',
  1
),
(
  '欢迎来到华澳浸信会展信堂',
  '欢迎来到华澳浸信会展信堂。我们是一个服务悉尼华人社区的多语言教会。欢迎本周日参加礼拜！',
  'sc',
  1
) ON CONFLICT DO NOTHING;

-- Sample sermons
INSERT INTO sermons (title, date, youtube_url, language, preacher) VALUES
(
  'Sample Sermon - Finding Peace in Turbulent Times',
  '2026-04-06',
  'https://youtube.com/watch?v=dQw4w9WgXcQ',
  'en',
  'Pastor John Smith'
),
(
  '範例講道 - 在動盪中找到平安',
  '2026-04-06',
  'https://youtube.com/watch?v=dQw4w9WgXcQ',
  'tc',
  '馮牧師'
),
(
  '示例讲道 - 在动荡中找到平安',
  '2026-04-06',
  'https://youtube.com/watch?v=dQw4w9WgXcQ',
  'sc',
  '冯牧师'
) ON CONFLICT DO NOTHING;