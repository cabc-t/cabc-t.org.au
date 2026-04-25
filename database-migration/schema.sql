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


-- 1. Create the base table (Global properties)
create table public.regular_events (
  id uuid default gen_random_uuid() primary key,
  icon_name text not null default 'users',
  tag_key text not null, -- Internal key (e.g., 'service', 'youth', 'outreach'). Used for logic, filtering, CSS colors
  created_at timestamptz default now()
);

-- 2. Create the translations table (Localized content)
create table public.event_translations (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.regular_events(id) on delete cascade,
  locale VARCHAR(2) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'tc', 'sc')),
  title text not null,
  day_text text,      -- e.g., 'Sunday' or '星期日'
  time_text text,     -- e.g., '9:00 AM' or '上午 9:00'
  location text,
  description text,
  language_label text,        -- e.g., 'English' or '廣東話'
  tag_label text,             -- e.g., 'Service' or '崇拜'. Used for reading, UI Display
  
  -- Prevent having two translations for the same language on one event
  unique(event_id, locale)
);

-- 3. Enable Security
alter table public.regular_events enable row level security;
alter table public.event_translations enable row level security;

create policy "Public Read Events" on public.regular_events for select using (true);
create policy "Public Read Translations" on public.event_translations for select using (true);

-- 4. Seed Data Example: Sunday English Service
do $$
declare
  v_event_id uuid;
begin
  -- Create the Global Event entry
  insert into public.regular_events (icon_name, tag_key) values ('Users', 'service') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'English Service', 'Sunday', '9 AM', 'Main Hall and Online', 'Worship, prayer and teaching', 'English', 'Service');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '英文崇拜', '星期日', '上午9時', '正堂及網上', '敬拜、禱告和教導', '英語', '崇拜');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '英文崇拜', '星期日', '上午9时', '正堂及网上', '敬拜、祷告和教导', '英语', '崇拜');

  insert into public.regular_events (icon_name, tag_key) values ('Users', 'service') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Mandarin Service', 'Sunday', '9 AM', 'Side Hall and Online', 'Worship, prayer and teaching', 'Mandarin', 'Service');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '國語崇拜', '星期日', '上午9時', '正堂及網上', '敬拜和教導', '國語', '崇拜');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '国语崇拜', '星期日', '上午9时', '正堂及网上', '敬拜和教导', '国语', '崇拜');

  insert into public.regular_events (icon_name, tag_key) values ('Users', 'service') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Sunday Cantonese Service', 'Sunday', '11 AM', 'Main Hall', 'Worship, teaching and Q&A', 'Cantonese', 'Service');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '週日粵語崇拜', '星期日', '上午11時', '正堂及網上', '敬拜、教導和問答', '粵語', '崇拜');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '週日粤语崇拜', '星期日', '上午11时', '正堂及网上', '敬拜、教导和问答', '粤语', '崇拜');

  insert into public.regular_events (icon_name, tag_key) values ('Users', 'service') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Saturday Cantonese Service', 'Saturday', '10 AM', 'Main Hall', 'Worship, teaching and Q&A', 'Cantonese', 'Service');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '週六粵語崇拜', '星期六', '上午10時', '正堂及網上', '敬拜、教導和小組討論', '粵語', '崇拜');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '週六粤语崇拜', '星期六', '上午10时', '正堂及网上', '敬拜、教导和小组讨论', '粤语', '崇拜');

  insert into public.regular_events (icon_name, tag_key) values ('School', 'sunday school - children') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Children Sunday School', 'Sunday', '9 AM', 'Manse', 'Help primary school kids to LEARN who God is, LOVE God with all our heart and LIVE out the renewed life', 'English', 'Sunday School - Children');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '兒童主日學', '星期日', '上午9時', '旁屋', '幫助小學生認識上帝(LEARN)，全心愛上帝(LOVE)，而活出新生命(LIVE)。', '英語', '兒童主日學');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '儿童主日学', '星期日', '上午9时', '旁屋', '帮助小学生认识上帝(LEARN)，全心爱上帝(LOVE)，而活出新生命(LIVE)。', '英语', '儿童主日学');

  insert into public.regular_events (icon_name, tag_key) values ('School', 'children sunday school') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Children Sunday School', 'Sunday', '11 AM', 'Manse', 'Help primary school kids to LEARN who God is, LOVE God with all our heart and LIVE out the renewed life', 'English', 'Sunday School - Children');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '兒童主日學', '星期日', '上午9時', '旁屋', '幫助小學生認識上帝(LEARN)，全心愛上帝(LOVE)，而活出新生命(LIVE)。', '英語', '兒童主日學');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '儿童主日学', '星期日', '上午11时', '旁屋', '帮助小学生认识上帝(LEARN)，全心爱上帝(LOVE)，而活出新生命(LIVE)。', '英语', '儿童主日学');

  insert into public.regular_events (icon_name, tag_key) values ('School', 'sunday school') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Youth Bible Study', 'Sunday', '11 AM', 'Side Hall', 'Equip high schoolers to navigate life and dive deeper into God’s Word together', 'English', 'Sunday School');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '青少年查經', '星期日', '上午11時', '副堂', '幫助中學生深入地研讀神的話語，應付人生', '英語', '主日學');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '青少年查经', '星期日', '上午11时', '副堂', '帮助中学生深入地研读神的话语，应付人生', '英语', '主日学');

  insert into public.regular_events (icon_name, tag_key) values ('School', 'sunday school') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Adult Sunday School', 'Sunday', '11 AM', 'Rooms 6-7', 'Ezra', 'Mandarin', 'Sunday School');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '主日學', '星期日', '上午11時', '6-7號房', '以斯拉記', '國語', '主日學');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '主日学', '星期日', '上午11时', '6-7号房', '以斯拉记', '国语', '主日学');

  insert into public.regular_events (icon_name, tag_key) values ('School', 'sunday school') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Adult Sunday School', 'Sunday', '1:30 PM', 'Rooms 6-7', 'The gospel of Luke', 'Cantonese', 'Sunday School');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '主日學', '星期日', '下午1時半', '6-7號房', '路加福音', '粵語', '主日學');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '主日学', '星期日', '下午1时半', '6-7号房', '路加福音', '粤语', '主日学');

  insert into public.regular_events (icon_name, tag_key) values ('School', 'sunday school') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Adult Sunday School', 'Saturday', '1 PM', 'Rooms 6-7', '1 King', 'Cantonese', 'Sunday School');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '主日學', '星期六', '下午1時', '6-7號房', '列王記上', '粵語', '主日學');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '主日学', '星期六', '下午1时', '6-7号房', '列王记上', '粤语', '主日学');

  insert into public.regular_events (icon_name, tag_key) values ('TreePalm', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Golden Age Fellowship', 'Saturday', '2 PM', 'Side Hall', 'Welcome all brothers and sisters who are approaching, planning to retire, or have already retired. Live a more fulfilling second half of life, build up your spiritual growth, and equip for service. Held monthly (on the third Saturday).', 'Cantonese', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '金齡團契', '星期六', '下午2時', '副堂', '歡迎所有邁向、計劃退休及已退休的弟兄姊妹參加。內容:如何在人生下半場活得更精彩;協助信徒靈命成長,彼此建立,裝備服侍。每月舉辦一次（第三個週六）。', '粵語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '金龄团契', '星期六', '下午2时', '副堂', '欢迎所有迈向、计划退休及已退休的弟兄姊妹参加。内容:如何在人生下半场活得更精彩;协助信徒灵命成长,彼此建立,装备服侍。每月举办一次（第三个周六）。', '粤语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('BookHeart', 'sunday school - children') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Women DLT', 'Saturday', '', 'Various', 'Doing Life Together - Join us for a relaxing bushwalk, craft, or conversation, followed by a time of reading the Bible and praying with one another. Held monthly.', 'English', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '女仕聚會', '星期六', '', '', '攜手同行－歡迎加入我們，享受輕鬆的遠足、手工活動或暢談，之後一起閱讀聖經，彼此禱告。每月一次。', '英語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '女仕聚会', '星期六', '', '', '携手同行－欢迎加入我们，享受轻松的远足、手工活动或畅谈，之后一起阅读圣经，彼此祷告。每月一次。', '英语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('LifeBuoy', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Men group', 'Saturday', '6:30 PM', '', 'BLT - Burger Life Together. Held monthly.', 'English', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '男仕聚會', '星期六', '下午6時半', '', '生命同行小組。每月舉辦一次。', '粵語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '男仕聚会', '星期六', '下午6时半', '', '生命同行小组。每月举办一次。', '粤语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('CookingPot', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Life Sharing', 'Sunday', '1 PM', 'Side Hall', 'A relaxed lunchtime gathering focused on authentic life sharing and peer connection. Held quarterly.', 'Cantonese', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '生命分享', '星期日', '下午1時', '副堂', '輕鬆的午餐聚會，旨在分享真實的生活點滴，促進同伴間的交流。每季舉辦一次。', '粵語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '生命分享', '星期日', '下午1时', '副堂', '轻松的午餐聚会，旨在分享真实的生活点滴，促进同伴间的交流。每季举办一次。', '粤语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('Coffee', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'TYF', 'Sunday', '7:30 PM', 'Side Hall', 'Help every young person know they are deeply loved by God and encouraging them to live in response to His love. It has a mix of games, music, Bible studies, social events, annual camp in a safe and welcoming environment. High School Students (Years 7 – 12) are welcome.', 'English', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '英語青年團契', '星期五', '下午7時半', '副堂', '活動內容豐富多彩，包括遊戲、音樂、查經、社交活動和年度營會。歡迎7至12級的中學生參加。讓每位青少年明白上帝愛他們，並鼓勵他們活出這份愛的回應', '英語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '英语青年团契', '星期五', '下午7时半', '副堂', '活动内容丰富多彩，包括游戏、音乐、查经、社交活动和年度营会。欢迎7至12级的中学生参加。让每位青少年明白上帝爱他们，并鼓励他们活出这份爱的回应', '英语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('Briefcase', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'CYF', 'Friday', '8 PM', 'Main Hall', 'Build community and grow in faith together for young adults navigating life and career.', 'Cantonese', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '粵語青年團契', '星期五', '下午8時', '正堂', '為正在經歷大專和職業生涯的年輕人建立社群，共同成長，增進信仰。', '粵語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '粤语青年团契', '星期五', '下午8时', '正堂', '为正在经历大专和职业生涯的年轻人建立社群，共同成长，增进信仰。', '粤语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('TreePalm', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Leisure Centre', 'Thursday', '10 AM', 'Side Hall', 'A friendly, welcoming fellowship group for retired adults (Christians and friends) to gather, share, and learn.', 'Cantonese', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '樂齡中心', '星期四', '上午10時', '副堂', '一個有活力的退休人士聯誼小組，適合任何信仰的朋友，大家聚會、分享和學習。', '粵語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '乐龄中心', '星期四', '上午10时', '副堂', '一个有活力的退休人士联谊小组，适合任何信仰的朋友，大家聚会、分享和学习。', '粤语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('Piano', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Choir', 'Thursday', '7:30 PM', 'Main Hall', 'Lift your voice and join our vibrant community in praising through song.', 'Cantonese', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '詩班', '星期四', '下午7時半', '正堂', '放聲歌唱，加入我們充滿活力的社群，用歌聲讚美！', '粵語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '诗班', '星期四', '下午7时半', '正堂', '放声歌唱，加入我们充满活力的社群，用歌声赞美！', '粤语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('Clock', 'prayer') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Prayer Meeting', 'Wednesday', '8 PM', 'Zoom', 'A focused time of intercession and community prayer.', 'Cantonese', 'Prayer Meeting');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '祈禱會', '星期三', '下午8時', '網上', '集體禱告時間', '粵語', '祈禱會');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '祈祷会', '星期三', '下午8时', '网上', '集体祷告时间', '粤语', '祈祷会');

  insert into public.regular_events (icon_name, tag_key) values ('Clock', 'prayer') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Prayer Meeting', 'Wednesday', '8 PM', 'Zoom', 'A focused time of intercession and community prayer. Held monthly.', 'Mandarin', 'Prayer Meeting');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '祈禱會', '星期三', '下午8時', '網上', '集體禱告時間', '國語', '祈禱會');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '祈祷会', '星期三', '下午8时', '网上', '集体祷告时间', '国语', '祈祷会');

  insert into public.regular_events (icon_name, tag_key) values ('University', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'PLUS', 'Wednesday', '8 PM', 'Rooms 6-7', 'Supports students and apprentices through weekly Bible study, prayer, and community service. Join us as we share life together, grow in our faith, and learn to represent Jesus in our studies and training.', 'English', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', 'PLUS', '星期三', '下午8時', '6-7號房', '透過每週的查經、禱告和社區服務來支持學生和學員。歡迎加入，與我們一同分享生活，在信仰中成長，並在學習和訓練中效法耶穌。', '英語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', 'PLUS', '星期三', '下午8时', '6-7号房', '透过每周的查经、祷告和社区服务来支持学生和学员。欢迎加入，与我们一同分享生活，在信仰中成长，并在学习和训练中效法耶稣。 ', '英语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('BookMarked', 'fellowship') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Bible Reading Fellowship', 'Monday', '8 PM', 'Zoom', 'Connect those who are interested in Bible reading and fellowship and deepen your encounters dialogues with yourself, fellow group members, and God. Held monthly.', 'Cantonese', 'Fellowship');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '讀經團契', '星期六', '上午10時', '正堂及網上', '聯繫有興趣讀經和團契的人，在讀經之餘加深與自己、與組員、與神相遇及對話。每月一次', '粵語', '團契');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '读经团契', '星期六', '上午10时', '正堂及网上', '联系有兴趣读经和团契的人，在读经之余加深与自己、与组员、与神相遇及对话。每月一次', '粤语', '团契');

  insert into public.regular_events (icon_name, tag_key) values ('BookOpen', 'cell') returning id into v_event_id;
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'en', 'Small Groups', 'Various', '', '', 'Deep dive into a small group setting.', '', 'Cell');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'tc', '小組', '各異', '', '', '加入小組，體驗真正的社群生活', '', '小組');
  insert into public.event_translations (event_id, locale, title, day_text, time_text, location, description, language_label, tag_label)
  values (v_event_id, 'sc', '小组', '各异', '', '', '加入小组，体验真正的社群生活', '', '小组');

end $$;
