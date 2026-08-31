# Siddhivinayak Overseas — Production Platform

> **⚠️ IMPORTANT**: See [AUDIT_SUMMARY.md](./AUDIT_SUMMARY.md) and [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for recent fixes and setup instructions.

## Recent Updates (May 6, 2026)

✅ **All Critical Issues Fixed**:
- Fixed useAuth hook subscription memory leak
- Removed static export to enable API routes & authentication
- Created missing pages (forgot-password, terms, privacy)
- Fixed Link component prop errors
- Verified database schema and RLS policies
- All 17 pages now build successfully

**Status**: Ready for deployment once database is configured.

---

## Overview

Complete production-ready SaaS platform for visa/immigration consultancy with:
- Next.js 16 App Router + TypeScript + Tailwind CSS
- Supabase backend (Auth + PostgreSQL + APIs)
- Interactive 3D Earth globe with React Three Fiber
- Premium UI/UX with glassmorphism design
- Full SEO optimization (metadata, sitemap, JSON-LD)
- ✅ API routes and middleware enabled (updated May 6)

---

## Folder Structure

```
app/
├── auth/
│   ├── login/page.tsx          # Email + Google OAuth login
│   ├── register/page.tsx       # Account creation
│   └── callback/route.ts       # OAuth callback handler
├── countries/
│   ├── page.tsx                # Countries listing
│   └── [slug]/
│       ├── page.tsx              # Country detail
│       └── programs/
│           └── [programSlug]/
│               └── page.tsx      # Visa program detail
├── dashboard/
│   └── page.tsx                # User dashboard (protected)
├── layout.tsx                  # Root layout with SEO + JSON-LD
├── page.tsx                    # Home with 3D globe hero
├── sitemap.ts                  # Dynamic SEO sitemap
├── robots.ts                   # robots.txt generation
├── globals.css                 # Tailwind + custom theme
├── contact/
├── work-visa/
├── study-visa/
├── services/
├── about/
components/
├── interactive-globe.tsx        # 3D Earth (Three.js / R3F)
├── site-header.tsx              # Navigation with auth state
├── site-footer.tsx              # Footer
├── hero.tsx                     # Home hero section
├── ui/                          # shadcn/ui components
hooks/
├── use-auth.ts                  # Authentication hook
├── use-countries.ts             # Countries + visa programs hooks
lib/
├── supabase/
│   ├── client.ts                # Browser Supabase client
│   └── server.ts                # Server Supabase client
├── database.types.ts            # Full TypeScript types
├── utils.ts                     # Utility functions
middleware.ts                   # Route protection + auth refresh
supabase/
├── schema.sql                   # Complete PostgreSQL schema
└── seed.sql                     # Sample data for 10+ countries
```

---

## 1. Supabase Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** (Settings > API)

### Step 2: Run Schema
1. Open Supabase Dashboard > SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Run the entire script
4. Then run `supabase/seed.sql` to populate sample data

### Step 3: Configure Auth
1. Go to Authentication > Providers
2. Enable **Email** provider (already enabled by default)
3. Enable **Google** provider:
   - Add your Google Client ID and Secret
   - Set redirect URL: `https://yourdomain.com/auth/callback`

### Step 4: Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 2. Database Design

### Tables
| Table | Purpose |
|-------|---------|
| `countries` | Master country data with Geo info, costs, climate |
| `visa_programs` | All visa programs per country with eligibility |
| `user_profiles` | Extended user data (auth.users extension) |
| `applications` | Visa application tracking |
| `consultations` | Free/paid consultation bookings |
| `saved_places` | User favorites (countries/programs) |
| `interactions` | Analytics/events tracking |
| `blog_posts` | SEO content management |
| `notifications` | User notifications |
| `country_faqs` | Country-specific FAQ |

### Views
- `public_countries` — Active countries only
- `public_visa_programs` — Active programs with country joins
- `featured_programs` — Featured programs only
- `user_dashboard_summary` — Aggregated user stats

### Indexes
- All foreign keys indexed
- Search indexes on `slug`, `name`, `status`
- Composite indexes for common queries

### RLS Policies
- Users can only access own data (applications, consultations, saved places)
- Public read access for countries, visa programs, blog posts, FAQs
- Admin role override for all data

---

## 3. Backup Strategy

### Supabase Built-in Backups
- Supabase Pro plans include **daily automated backups**
- Backups are stored in the same region as your project
- Retention: 7 days (configurable on higher tiers)

### Manual Backup (pg_dump)
```bash
# Get your database password from Supabase Dashboard > Settings > Database
pg_dump \
  --host db.xxxxx.supabase.co \
  --port 5432 \
  --dbname postgres \
  --username postgres \
  --file backup-$(date +%Y%m%d).sql \
  --clean \
  --if-exists
```

### Restore Process
```bash
psql \
  --host db.xxxxx.supabase.co \
  --port 5432 \
  --dbname postgres \
  --username postgres \
  --file backup-20240101.sql
```

### Best Practices
1. Schedule weekly manual backups in addition to automated ones
2. Test restore procedure on a staging project monthly
3. Use Supabase branching for major schema changes
4. Enable Point-in-Time Recovery (PITR) for critical projects

---

## 4. Authentication

### Features
- **Email/Password**: Standard registration with profile creation
- **Google OAuth**: One-click sign-in with profile auto-creation
- **Middleware Protection**: `/dashboard`, `/profile`, etc. require login
- **Session Management**: Automatic refresh via Supabase SSR

### Protected Routes (middleware.ts)
- `/dashboard` → redirects to `/auth/login` if not authenticated
- `/auth/login`, `/auth/register` → redirects to `/dashboard` if already logged in

---

## 5. 3D Globe Implementation

### Tech Stack
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Helpers (Stars, OrbitControls, Html)
- Custom shaders for atmosphere glow
- Procedural earth texture (no external dependencies)

### Features
- Realistic Earth sphere with bump mapping
- Animated atmosphere glow (custom GLSL shader)
- Interactive country markers at accurate lat/lng
- Connection arcs from India to all destinations
- OrbitControls: drag to rotate, scroll to zoom
- Click markers → info panel with country details
- Lazy loaded via `React.lazy()` + `Suspense`

### Performance
- `dpr={[1, 2]}` — adaptive pixel ratio
- `gl={{ antialias: true, alpha: true }}`
- Lazy loaded only when user clicks "Launch 3D Globe"
- Low-poly sphere with CanvasTexture (no external image downloads)

---

## 6. SEO Implementation

### What is implemented
- **Next.js Metadata API** — every page has unique meta tags
- **Dynamic meta tags** — country pages, visa program pages
- **sitemap.xml** — automatically generated, includes all dynamic routes
- **robots.txt** — allows public pages, blocks dashboard/auth from indexing
- **JSON-LD** — ProfessionalService schema + WebSite schema in layout
- **Open Graph** — proper og:title, og:description, og:image
- **Twitter Cards** — summary_large_image
- **Canonical URLs** — prevents duplicate content
- **Core Web Vitals** — optimized with static export, minimal JS

### Dynamic SEO
- Country pages use `meta_title` and `meta_desc` from database
- Program pages use their own meta fields
- Sitemap fetches all countries and programs at build time

---

## 7. Performance Optimizations

1. **Lazy loading** — 3D globe only loads on user interaction
2. **Static export** — pre-rendered HTML, no server needed
3. **Image optimization** — `unoptimized: true` for Hostinger (static hosting)
4. **Code splitting** — Next.js automatic chunk splitting
5. **Tree shaking** — only used components bundled
6. **CSS optimization** — Tailwind purges unused styles

---

## 8. Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# The `dist/` folder is ready for Hostinger deployment
```

---

## 9. Deployment on Hostinger

### Prerequisites
- Hostinger shared hosting plan (or any static hosting)
- Domain pointed to Hostinger

### Build Steps
```bash
# 1. Set environment variables
export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
export NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# 2. Build static export
npm run build

# 3. The `dist/` folder contains your static site
```

### Upload to Hostinger
1. Open Hostinger File Manager (or use FTP)
2. Navigate to `public_html/`
3. Delete existing files (backup first)
4. Upload all contents of `dist/` folder
5. Ensure `index.html` is at root of `public_html/`

### Important Notes
- No Node.js server needed — this is a static site
- All dynamic data comes from Supabase client-side
- Auth works via Supabase cookies
- For client-side routing to work, add `.htaccess`:

```apache
# .htaccess for Hostinger (place in public_html/)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 10. CRUD Operations Examples

### Using useAuth Hook
```tsx
const { user, profile, signIn, signUp, signInWithGoogle, signOut, updateProfile } = useAuth()
```

### Using useCountries Hook
```tsx
const { countries, isLoading, error, getCountryBySlug } = useCountries()
const { country, programs, isLoading } = useCountry("japan")
const { programs, isLoading } = useVisaPrograms({ countryId: "uuid", type: "work" })
const { program, isLoading } = useVisaProgram("japan", "specified-skilled-worker")
```

### Direct Supabase CRUD
```tsx
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

// Create application
const { data, error } = await supabase
  .from("applications")
  .insert({
    user_id: user.id,
    visa_program_id: programId,
    country_id: countryId,
    application_type: "work",
    status: "draft"
  })
  .select()

// Read with filters
const { data } = await supabase
  .from("public_visa_programs")
  .select("*")
  .eq("is_featured", true)

// Update
const { data } = await supabase
  .from("user_profiles")
  .update({ full_name: "New Name" })
  .eq("id", user.id)
  .select()

// Delete
await supabase.from("saved_places").delete().eq("id", savedId)
```

---

## 11. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your production domain |

---

## 12. Troubleshooting

### Build fails with "Build directory is not writeable"
- This is a sandbox-specific issue. In production, run `npm run build` normally.

### Dynamic routes not generated
- Ensure Supabase credentials are set during build
- `generateStaticParams` needs real data to create static pages

### Google OAuth not working
- Verify redirect URL in Google Console matches `https://yourdomain.com/auth/callback`
- Ensure URL is added to Supabase Auth > Providers > Google

### Middleware deprecation warning
- Next.js 16 deprecates `middleware.ts` in favor of `proxy.ts`
- This is cosmetic — functionality is unchanged
- To suppress: rename `middleware.ts` to `proxy.ts` when Next.js fully transitions

---

Built with care for global aspirants.
#   n e w - w i t h - w h i t e  
 #   2 5 t h  
 #   2 5 t h  
 #   2 5 t h _ u p d a t e d  
 #   a d m i n  
 #   u p d a t e d  
 #   2 5 t h _ 0 8  
 