# Project Prompt: CABC Thornleigh Church Website

Use this prompt to regenerate the complete project with AI assistance.

---

## Project Overview

Build a modern, multilingual church website for Chinese Australian Baptist Church - Thornleigh using Next.js 14 with App Router. The site supports English, Traditional Chinese (繁體), and Simplified Chinese (簡體) with tri-lingual navigation.

---

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (for announcements and sermons)
- **Icons**: Lucide React
- **Fonts**: Playfair Display (headings), Inter (body)
- **Date formatting**: date-fns
- **Security**: DOMPurify for HTML sanitization

---

## Key Features

1. **Tri-lingual Support**: Full i18n for EN/TC/SC with language switcher in header
2. **Homepage with Anchor Navigation**: All sections accessible via nav links (#services, #children, #cells, #about, #sermons, #news)
3. **Dynamic Content**: Announcements and Sermons fetched from Supabase
4. **Horizontal Scroll**: News/Announcements and Sermons on homepage with drag-to-scroll and dot indicators
5. **Modal Popup**: Click announcements to view full content in modal
6. **Responsive Design**: Mobile-first with sticky header
7. **Root URL Redirect**: `/` redirects to `/en`
8. **Security**: HTML sanitization using DOMPurify to prevent XSS attacks

---

## Directory Structure

```
work-006/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # Homepage with all sections
│   │   │   ├── about/page.tsx
│   │   │   ├── sermons/page.tsx      # 60 sermons, vertical grid
│   │   │   ├── announcements/page.tsx # Full announcements list
│   │   │   ├── statements-of-faith/page.tsx
│   │   │   ├── safe-church/page.tsx
│   │   │   └── privacy-policy/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css               # scroll-padding: 80px
│   ├── components/
│   │   ├── Header.tsx               # Anchor link navigation
│   │   ├── Footer.tsx
│   │   ├── Announcements.tsx        # Horizontal scroll with dots, modal
│   │   ├── SermonsList.tsx          # Horizontal scroll (homepage) / grid (sermons page)
│   │   └── ClientLocale.tsx         # Client-side locale detection
│   ├── lib/
│   │   ├── i18n.ts
│   │   ├── translations.ts           # All EN/TC/SC translations
│   │   ├── constants.ts             # Colors, URLs
│   │   └── supabase/client.ts
│   └── middleware.ts                  # Root URL redirect to /en
├── public/images/
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── .env.local
```

---

## Homepage Sections (in order)

1. **Hero** - Dark gradient background, church logo, welcome message, YouTube link
2. **Announcements/News** (#news) - Horizontal scroll cards with drag, dot indicators, modal for full content
3. **Community** - 3 cards: Multicultural, Inclusive, Welcoming
4. **Sunday Services** (#services) - 3 columns for Cantonese/Mandarin/English times
5. **Children's Ministry** (#children) - Light purple bg, 3L program + Gospel Project info, image
6. **Youth Programs** (EN only) - TYF Friday section
7. **Senior Fellowship** (TC only) - 金齡團契
8. **Senior** (SC only) - 颐乐中心
9. **Cell Groups** (#cells) - Gray bg, text left + image right
10. **Sermons** (#sermons) - Horizontal scroll with dot indicators, 6 sermons
11. **About** (#about) - Church history

---

## Navigation (Header)

Nav items (in order):
1. Home → `/en`
2. News → `/en#news`
3. Services → `/en#services`
4. Children → `/en#children`
5. Cell Groups → `/en#cells`
6. About → `/en#about`
7. Sermons → `/en#sermons` (hidden when on Sermons page)

All nav links use anchor IDs matching section IDs in homepage.

---

## Content Limits

| Location | Content | Limit | Layout |
|----------|---------|-------|--------|
| Homepage | Announcements | 6 | Horizontal scroll with dot indicators |
| Homepage | Sermons | 6 | Horizontal scroll with dot indicators |
| Sermons Page | Sermons | 60 | Vertical grid (3 columns) |
| Announcements Page | Announcements | 20 | Vertical list |

---

## Design System

- **Primary Color**: #263880 (indigo - matches church logo)
- **Accent Color**: #f59e0b (amber)
- **Header**: White background, sticky, logo left, nav center
- **Backgrounds**:
  - Gray-50 for general sections
  - Gradient purple-50 for Community
  - Light purple #f7effa for Children's Ministry
  - Dark gradient for Hero
- **Scroll Padding**: 80px (sticky header offset)
- **Fonts**:
  - Display: Playfair Display (serif)
  - Body: Inter (sans-serif)

---

## Translations Required

All text must be translated for EN, TC, SC. Key translation keys:
- nav: home, services, children, cells, about, sermons, announcements
- hero: welcome, subtitle
- services: title, cantonese/mandarin/english + times
- children: program, material, learn/love/live, features
- youth: title, subtitle, community/teaching/leadership
- seniors: title, serve/build/grow
- smallGroups: title, diveDeeper, encourage
- about: title, history (long text)
- contact: address, phone, email

---

## Supabase Schema

**announcements** table:
- id (uuid)
- title (text)
- content (text, HTML - requires sanitization)
- language (text: 'en'/'tc'/'sc') - original language
- created_at (timestamp)
- priority (number) - smaller number = higher priority
- visibility_language (text[]) - which languages can view: ['en'], ['tc','sc'], ['en','tc','sc']
- start_date (date) - announcement starts showing (default: today)
- end_date (date, nullable) - announcement stops showing (null = show forever)
- image_url (text, nullable) - thumbnail image URL
- pdf_url (text, nullable) - PDF attachment URL

**sermons** table:
- id (uuid)
- title (text)
- date (date)
- youtube_url (text)
- language (text: 'en'/'tc'/'sc'/'all')
- preacher (text)

---

## Security Implementation

All HTML content from Supabase must be sanitized before rendering:

```typescript
import DOMPurify from "dompurify";

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

Install: `npm install dompurify @types/dompurify`

---

## Implementation Notes

1. Use `ClientLocale` hook for client-side locale detection (fixes sticky header locale issue)
2. Announcements: Horizontal scroll with drag-to-scroll, color-coded tiles, dot indicators, modal popup
3. Sermons: Supports both horizontal scroll (homepage with dots) and grid layout (sermons page)
4. Middleware redirects `/` to `/en`
5. Add `scroll-padding-top: 80px` to html for anchor scroll offset

---

## Commands

```bash
npm install
npm run dev     # Development at localhost:3000
npm run build   # Production build
npm start      # Production server
```

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://www.cabc-t.org.au
```

---

## Recommended RLS Policies (Supabase)

Enable Row Level Security on Supabase dashboard:

```sql
-- Enable RLS on announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT USING (true);

-- Enable RLS on sermons
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_sermons" ON sermons FOR SELECT USING (true);
```

---

Use this prompt to rebuild the complete project. The result should be a fully functional multilingual church website with all sections, navigation, translations, Supabase integration, and security features.