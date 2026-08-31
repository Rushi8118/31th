# 🔧 URGENT REQUIREMENTS & COUNTRIES FIX GUIDE

## ❌ Problems Identified

1. **EyeOff icon not imported** - ✅ FIXED
2. **Urgent Requirements table doesn't exist in Supabase** - 🔴 NEEDS DATABASE SETUP
3. **Hide/Show toggle not working** - 🔴 NEEDS DATABASE SETUP
4. **404 errors when fetching data** - 🔴 NEEDS DATABASE SETUP

## ✅ What Has Been Fixed (Code Level)

### 1. EyeOff Import Fixed
- **File:** `src/pages/admin/UrgentRequirementsAdminPage.tsx`
- **Change:** Added `EyeOff` to lucide-react imports
- **Status:** ✅ Complete

```javascript
// Line 5 - Now includes EyeOff
import {
  Flame, Plus, Sparkles, Pencil, Trash2, Eye, EyeOff, Clock, Users,
  CheckCircle2, XCircle, Search, RefreshCw, Calendar, Loader2,
  ExternalLink, DollarSign, Briefcase, Image as ImageIcon
} from 'lucide-react'
```

### 2. Database Schema Created
- **File:** `supabase/FIX_URGENT_REQUIREMENTS.sql`
- **Status:** ✅ Ready to run

## 🚀 STEP-BY-STEP FIX INSTRUCTIONS

### Step 1: Run SQL Migration in Supabase

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/
   - Select your project: `ugvtrtlnufzkjgxhucji`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Run the SQL Script**
   - Open the file: `supabase/FIX_URGENT_REQUIREMENTS.sql`
   - Copy ALL the contents
   - Paste into Supabase SQL Editor
   - Click "Run" button (or press Ctrl/Cmd + Enter)

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - Check the verification queries at the bottom show:
     - `table_exists: true`
     - Multiple indexes created
     - 2 policies created

### Step 2: Verify Table Structure

Run this query in Supabase SQL Editor to verify:

```sql
-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'urgent_requirements'
ORDER BY ordinal_position;
```

Expected columns:
- id (text)
- title (text)
- slug (text)
- country (text)
- country_code (text)
- category (text)
- vacancies (integer)
- salary (text)
- experience_required (text)
- image_url (text)
- summary (text)
- content (text)
- status (text) - only 'active', 'closed', or 'expired'
- expires_at (timestamptz)
- created_at (timestamptz)
- updated_at (timestamptz)

### Step 3: Test the Admin Panel

1. **Login to Admin Panel**
   - Go to: http://localhost:5001/admin
   - Login with your admin credentials

2. **Navigate to Urgent Requirements**
   - Click "Urgent Openings" in the sidebar
   - You should see the page load without errors

3. **Test Creating a Requirement**
   - Click "Add Urgent Requirement"
   - Fill in the form:
     - Title: "Test Urgent Opening"
     - Country: UK
     - Category: Healthcare
     - Vacancies: 5
     - Salary: £25,000/year
     - Content: "Test description"
   - Click Save
   - Should save successfully and appear in the list

4. **Test Hide/Show Toggle**
   - Find the Eye icon (👁️) on a requirement row
   - Click it - should turn to EyeOff icon (crossed eye)
   - Status should change to "Closed" or "Stopped"
   - Click again - should turn back to Eye icon
   - Status should change to "Active"

### Step 4: Test Public View

1. **Open User-Facing Page**
   - Go to: http://localhost:5001/urgent-requirements
   - Should see ONLY active requirements

2. **Test Hide Functionality**
   - In admin panel, click Eye icon to hide a requirement
   - Refresh the public page: http://localhost:5001/urgent-requirements
   - The hidden requirement should NOT appear
   - Only active items should be visible

3. **Test Show Functionality**
   - In admin panel, click EyeOff icon to show the requirement again
   - Refresh the public page
   - The requirement should now appear

### Step 5: Test Countries Hide/Show

The countries table already has the `is_active` column, but verify:

1. **Navigate to Countries Admin**
   - Go to: http://localhost:5001/admin/countries
   - Should load without errors

2. **Test Country Toggle**
   - Find a country and click the Eye/EyeOff icon
   - Should toggle between active/inactive

3. **Verify Public Page**
   - Go to: http://localhost:5001/countries
   - Should only show active countries

## 🔍 How the Fix Works

### Row Level Security (RLS) Policies

**Public Users (not logged in):**
```sql
-- Can ONLY see active, non-expired requirements
SELECT * FROM urgent_requirements 
WHERE status = 'active' 
AND (expires_at IS NULL OR expires_at > NOW())
```

**Authenticated Users (admin):**
```sql
-- Can see and manage ALL requirements
SELECT * FROM urgent_requirements -- No restrictions
```

### Status Flow

```
Admin Panel Toggle:
┌─────────────────────────────────────────────┐
│ Active (Eye icon)   →   Click   →   Closed │
│ Closed (EyeOff icon) →   Click   →   Active│
└─────────────────────────────────────────────┘

Database Status:
┌─────────────────────────────────────────────┐
│ status = 'active'   → Public can see it     │
│ status = 'closed'   → Public CANNOT see it  │
│ expires_at < NOW()  → Public CANNOT see it  │
└─────────────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Error: "relation 'urgent_requirements' does not exist"
**Solution:** Run the SQL migration in Supabase SQL Editor

### Error: "404 Not Found" when fetching data
**Solution:** 
1. Check Supabase project URL in `.env` file
2. Verify the table was created (run verification query)
3. Check RLS policies are enabled

### Hide button not working
**Solution:**
1. Verify you're logged in as an authenticated user
2. Check browser console for errors
3. Ensure RLS policy for authenticated users exists

### Hidden items still showing on public page
**Solution:**
1. Clear browser cache and localStorage
2. Check the status in database: `SELECT slug, status FROM urgent_requirements;`
3. Verify RLS policy is filtering correctly

### Can't save new requirements
**Solution:**
1. Check if authenticated in admin panel
2. Verify permissions: `GRANT ALL ON urgent_requirements TO authenticated;`
3. Check browser console for detailed error message

## 📊 Database Queries for Debugging

### Check all urgent requirements and their status
```sql
SELECT 
    slug,
    title,
    country,
    status,
    expires_at,
    CASE 
        WHEN status = 'active' AND (expires_at IS NULL OR expires_at > NOW()) 
        THEN 'VISIBLE TO PUBLIC'
        ELSE 'HIDDEN FROM PUBLIC'
    END as visibility
FROM urgent_requirements
ORDER BY created_at DESC;
```

### Check countries active status
```sql
SELECT 
    slug,
    name,
    is_active,
    CASE 
        WHEN is_active = true THEN 'VISIBLE'
        ELSE 'HIDDEN'
    END as visibility
FROM countries
ORDER BY sort_order;
```

### Manually set a requirement to active
```sql
UPDATE urgent_requirements 
SET status = 'active', 
    expires_at = NOW() + INTERVAL '30 days'
WHERE slug = 'your-requirement-slug';
```

### Manually set a requirement to closed (hidden)
```sql
UPDATE urgent_requirements 
SET status = 'closed'
WHERE slug = 'your-requirement-slug';
```

## ✅ Success Checklist

- [ ] SQL migration executed successfully in Supabase
- [ ] Table `urgent_requirements` exists with correct columns
- [ ] RLS policies created (2 policies)
- [ ] Indexes created (5 indexes)
- [ ] Admin panel loads without errors
- [ ] Can create new urgent requirements
- [ ] Eye/EyeOff icon toggle works
- [ ] Hidden requirements don't appear on public page
- [ ] Active requirements appear on public page
- [ ] Countries admin page works without errors
- [ ] Countries hide/show toggle works
- [ ] No 404 errors in browser console

## 📝 Notes

- **Data Storage:** Previously data was only stored in localStorage. Now it's stored in Supabase database.
- **Migration:** Existing localStorage data won't automatically transfer. You may need to re-create items in the admin panel.
- **Cache:** Clear browser cache if you see stale data: `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)

## 🆘 Need Help?

If issues persist after following this guide:

1. Check browser console (F12) for JavaScript errors
2. Check Network tab for failed API calls
3. Verify Supabase connection in `.env` file
4. Check Supabase logs in dashboard under "Logs" section

---

**Last Updated:** August 31, 2026
**Status:** Ready for implementation
