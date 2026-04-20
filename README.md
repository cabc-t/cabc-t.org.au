# CABC Thornleigh Website

A modern Next.js 14 multilingual church website with tri-lingual support (English, Traditional Chinese, Simplified Chinese).

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd work-006
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local` based on `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://www.cabc-t.org.au
```

## Deployment

### Vercel Deployment

1. **Create Project in Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New..."** → **"Project"**
   - Select repository: `cabc-t.org.au`

2. **Configure Settings**:
   | Setting | Value |
   |---------|-------|
   | Project Name | `cabc-t-staging` (or your preferred name) |
   | Framework Preset | **Next.js** ⬅️ Important! |
   | Root Directory | `work-006` |

3. **Environment Variables**:
   Add these in Vercel project settings:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.cabc-t.org.au` (or staging URL) |

4. **Deploy**:
   - Click **Deploy** — Vercel will build and deploy
   - Visit the staging URL (e.g., `https://cabc-t-staging.vercel.app`)

### Staging URLs

- Production: `https://www.cabc-t.org.au`
- Staging: `https://cabc-t-org-au-stagining.vercel.app`

### Supabase Configuration

The website requires a Supabase project for dynamic content (announcements and sermons).

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project (or use existing)

2. **Create Tables**:

   ```sql
   -- Announcements table (extended with visibility, dates, attachments)
   CREATE TABLE announcements (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT,
     language TEXT CHECK (language IN ('en', 'tc', 'sc')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     priority INTEGER DEFAULT 100,
     visibility_language TEXT[] DEFAULT ARRAY['en', 'tc', 'sc'],
     start_date DATE DEFAULT CURRENT_DATE,
     end_date DATE,
     image_url TEXT,
     pdf_url TEXT
   );

   -- Sermons table
   CREATE TABLE sermons (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     date DATE,
     youtube_url TEXT,
     language TEXT CHECK (language IN ('en', 'tc', 'sc', 'all')),
     preacher TEXT
   );
   ```

3. **Enable RLS (Row Level Security)**:

   ```sql
   -- Announcements
   ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "public_read_announcements" ON announcements FOR SELECT USING (true);

   -- Sermons
   ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "public_read_sermons" ON sermons FOR SELECT USING (true);
   ```

4. **Get Credentials**:
   - In Supabase dashboard → Project Settings → API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `Project API keys` (anon public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## What Has Been Done

### Content & Features

- **Tri-lingual Support**: Full i18n for English (en), Traditional Chinese (tc), and Simplified Chinese (sc)
- **Homepage Sections** (with anchor IDs for navigation):
  - Hero with church mission, logo, and YouTube link
  - Announcements/News - Horizontal scroll with drag-to-scroll, dot indicators, modal for details, image thumbnails
  - Community section (multicultural, inclusive, welcoming)
  - Sunday Services (id: #services)
  - Children's Ministry (id: #children)
  - Youth Programs (TYF Friday) - English only
  - Senior Fellowship (金齡團契) - Traditional Chinese only
  - 颐乐中心 - Simplified Chinese only
  - Cell Groups (id: #cells)
  - About/History (id: #about)
  - Sermons (id: #sermons) - Horizontal scroll with dot indicators
- **Announcements Features**:
  - Multi-language visibility (`visibility_language`: show in en, tc/sc, or all)
  - Date-based publishing (`start_date`, `end_date` for automaticshow/hide)
  - Image thumbnails (full-card overlay with darkening)
  - PDF attachments (download link in modal/page)
- **Navigation**: All nav links jump to homepage sections via anchor links
- **Sermons Page**: Shows up to 60 sermons in vertical grid layout
- **Security**: HTML sanitization using DOMPurify to prevent XSS attacks

### Technical Implementation

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase for announcements and sermons
- **Typography**: Playfair Display (headings) + Inter (body)
- **Header**: White background with church logo, indigo accent color (#263880)
- **Middleware**: Redirects root URL `/` to `/en` (default locale)
- **Announcements**: Multi-language visibility, date-based publishing, image thumbnails, PDF attachments

### Design Updates

- **Header**: White background with logo on left, navigation center, language switcher right
- **Announcements**: Horizontal scroll with drag-to-scroll, dot indicators, modal popup for full content
- **Sermons (Homepage)**: Horizontal scroll with drag support and dot indicators
- **Children's Ministry**: Light purple background (#f7effa), two-column layout with image
- **Cell Groups**: Gray-50 background, two-column layout with image

## Design & Structure

### Directory Structure

```
work-006/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # Homepage with all sections
│   │   │   ├── about/page.tsx      # About page
│   │   │   ├── sermons/page.tsx     # Sermons page (60 sermons, vertical grid)
│   │   │   ├── announcements/page.tsx # Announcements page
│   │   │   ├── statements-of-faith/
│   │   │   ├── safe-church/
│   │   │   └── privacy-policy/
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles (scroll-padding: 80px)
│   ├── components/
│   │   ├── Header.tsx              # Navigation header with anchor links
│   │   ├── Footer.tsx               # Site footer
│   │   ├── Announcements.tsx       # Horizontal scroll cards with modal, dot indicators
│   │   ├── SermonsList.tsx          # Sermons component (supports horizontal/grid modes)
│   │   └── ClientLocale.tsx         # Client-side locale detection
│   ├── lib/
│   │   ├── i18n.ts                  # i18n configuration
│   │   ├── translations.ts          # All translations
│   │   ├── constants.ts             # Shared constants (colors, URLs)
│   │   └── supabase/client.ts       # Supabase client
│   └── middleware.ts                 # Root URL redirect to /en
├── public/
│   └── images/
│       ├── cabct-logo-raw.png.webp  # Church logo
│       ├── nemo-unsplash.jpg.webp    # Small Groups image
│       └── creatvise-dMVYJDwrBrU-unsplash.jpg.webp # Children's Ministry image
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── .env.local
└── .env.local.example
```

### Navigation

Nav items (in order):
1. Home → `/en`
2. News → `/en#news`
3. Services → `/en#services`
4. Children → `/en#children`
5. Cell Groups → `/en#cells`
6. About → `/en#about`
7. Sermons → `/en#sermons` (hidden on Sermons page)

### Content Limits

| Location | Content | Limit |
|----------|---------|-------|
| Homepage | Announcements | 6 |
| Homepage | Sermons | 6 (horizontal scroll with indicators) |
| Sermons Page | Sermons | 60 (vertical grid) |
| Announcements Page | Announcements | 20 |

### Design System

- **Primary Color**: Indigo (#263880) - matches church logo
- **Accent Color**: Amber/Gold (#f59e0b)
- **Header Background**: White (#ffffff)
- **Fonts**:
  - Display: Playfair Display (serif)
  - Body: Inter (sans-serif)
- **Responsive**: Mobile-first with breakpoints at 640px, 768px, 1024px
- **Scroll Padding**: 80px to account for sticky header

### Key Components

1. **Header**: Sticky, white background, anchor link navigation
2. **Footer**: Links, contact info, copyright
3. **Announcements**: Horizontal scroll with drag-to-scroll, dot indicators, color-coded cards, modal for details
4. **SermonsList**: Supports horizontal scroll (homepage) and grid layout (sermons page)
5. **ClientLocale**: Hook for client-side locale detection

### Security

- **HTML Sanitization**: All announcement content sanitized with DOMPurify before rendering
- **Supabase RLS**: Row Level Security policies should be enabled on Supabase dashboard

### Supabase Schema

Tables required:
- `announcements`: id, title, content, language, created_at, priority, visibility_language, start_date, end_date, image_url, pdf_url
- `sermons`: id, title, date, youtube_url, language, preacher

#### announcements table (extended)

```sql
-- Basic columns
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  language TEXT CHECK (language IN ('en', 'tc', 'sc')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority INTEGER DEFAULT 100,
  
  -- Multi-language visibility
  visibility_language TEXT[] DEFAULT ARRAY['en', 'tc', 'sc'],
  
  -- Date-based publishing
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE, -- null = show forever
  
  -- Attachments
  image_url TEXT,
  pdf_url TEXT
);
```

**visibility_language** controls which language pages show the announcement:
- `['en']` - English only
- `['tc']` - Traditional Chinese only
- `['sc']` - Simplified Chinese only
- `['tc', 'sc']` - Both Chinese versions
- `['en', 'tc', 'sc']` - All languages

## Languages

| Code | Language | Native Label |
|------|----------|--------------|
| en | English | EN |
| tc | Traditional Chinese | 繁 |
| sc | Simplified Chinese | 简 |

## References

- Original Drupal site: `/snapshot-10042026/`
- Base44 design reference: `/snapshot-11042026-base44/`
- Previous work: `/work-002/`