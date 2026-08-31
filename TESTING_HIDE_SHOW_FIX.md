# 🧪 Testing Hide/Show Fix - Step by Step

## ✅ What Was Fixed

### Code Changes:
1. **useUrgentRequirements.ts**
   - Removed stale localStorage initialization
   - Added cache clearing on toggle/delete
   - Increased timeout from 3s to 5s for better Supabase connection

2. **useAdminCountries.ts**
   - Added cache clearing on toggle

3. **cache-utils.ts** (NEW)
   - Utility functions for cache management

### Database Setup:
- Created `urgent_requirements` table with RLS policies
- Public users can ONLY see: `status='active' AND not expired`
- Admin users can see ALL items

## 🧪 Complete Testing Guide

### Part 1: Clear All Caches First

Open browser console (F12) and run:
```javascript
// Clear all localStorage
localStorage.clear()

// Reload page
location.reload()
```

### Part 2: Test Urgent Requirements

#### Step 1: Login to Admin
1. Go to: `http://localhost:5001/admin/urgent-requirements`
2. Login if needed

#### Step 2: Create Test Item
1. Click "+ Add Urgent Requirement"
2. Fill in:
   - Title: "TEST - 10 Nurses for UK NHS"
   - Slug: "test-uk-nurses"
   - Country: United Kingdom
   - Category: Healthcare
   - Vacancies: 10
   - Salary: £25,000/year
   - Content: "This is a test opening"
3. Click Save
4. Item should appear in admin list as **Active** (Eye icon 👁️)

#### Step 3: Verify Public Visibility (Active)
1. Open NEW browser tab (or incognito)
2. Go to: `http://localhost:5001/urgent-requirements`
3. **Expected:** "TEST - 10 Nurses for UK NHS" SHOULD appear
4. ✅ If visible = CORRECT

#### Step 4: Hide Item from Admin
1. Back to admin tab: `http://localhost:5001/admin/urgent-requirements`
2. Find "TEST - 10 Nurses for UK NHS"
3. Click the Eye icon (👁️)
4. Should change to EyeOff icon (🚫👁️)
5. Status changes to "Stopped" or "Closed"
6. Toast notification: "Requirement is now Hidden / Closed"

#### Step 5: Verify Public Visibility (Hidden)
1. Back to public tab: `http://localhost:5001/urgent-requirements`
2. Press F5 to refresh
3. **Expected:** "TEST - 10 Nurses for UK NHS" should NOT appear
4. ✅ If hidden = CORRECT ✅
5. ❌ If still visible = PROBLEM (see troubleshooting)

#### Step 6: Show Item Again
1. Back to admin tab
2. Click the EyeOff icon (🚫👁️)
3. Should change back to Eye icon (👁️)
4. Toast: "Requirement is now Active on website"

#### Step 7: Verify Public Visibility (Shown Again)
1. Back to public tab
2. Refresh (F5)
3. **Expected:** "TEST - 10 Nurses for UK NHS" SHOULD appear again
4. ✅ If visible = CORRECT ✅

### Part 3: Test Countries

#### Step 1: Admin Countries Page
1. Go to: `http://localhost:5001/admin/countries`

#### Step 2: Hide a Country
1. Find any country (e.g., "Germany")
2. Click the Eye icon to hide
3. Should change to EyeOff icon
4. Toast: "Germany is now Hidden from website"

#### Step 3: Verify Public Page
1. Go to: `http://localhost:5001/countries`
2. **Expected:** Germany should NOT appear
3. ✅ If hidden = CORRECT

#### Step 4: Show Country Again
1. Back to admin countries page
2. Click EyeOff icon on Germany
3. Should change to Eye icon
4. Toast: "Germany is now Active on website"

#### Step 5: Verify Public Page Again
1. Refresh countries page
2. **Expected:** Germany SHOULD appear
3. ✅ If visible = CORRECT

## 🐛 Troubleshooting

### Issue: Hidden items still show on public page

**Solution 1: Clear Browser Cache**
```javascript
// Open browser console (F12) and run:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

**Solution 2: Check Database Directly**
Go to Supabase SQL Editor and run:
```sql
-- Check status in database
SELECT slug, title, status, expires_at,
  CASE 
    WHEN status = 'active' AND (expires_at IS NULL OR expires_at > NOW()) 
    THEN 'VISIBLE' 
    ELSE 'HIDDEN' 
  END as visibility
FROM urgent_requirements
WHERE slug = 'test-uk-nurses';
```

**Solution 3: Force Refresh Without Cache**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Or use Incognito/Private window

**Solution 4: Check Network Tab**
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Find request to: `urgent_requirements?select=*&status=eq.active`
5. Check Response - should NOT include hidden items
6. If hidden items are in response = Database RLS policy issue

### Issue: Can't toggle status (nothing happens)

**Check:**
1. Are you logged in? (Check top-right corner)
2. Open Console (F12) - any errors?
3. Check Network tab - is API call being made?

**Fix:**
```sql
-- Run in Supabase SQL Editor
-- Ensure RLS policies exist
SELECT * FROM pg_policies WHERE tablename = 'urgent_requirements';

-- Should show 2 policies
-- If not, run the FIX_URGENT_REQUIREMENTS.sql script again
```

### Issue: 404 Error on urgent_requirements

**Solution:**
1. Table doesn't exist in Supabase
2. Go to Supabase SQL Editor
3. Run: `supabase/FIX_URGENT_REQUIREMENTS.sql`
4. Verify: `SELECT * FROM urgent_requirements;`

## 🔍 Debug Queries

### Check All Urgent Requirements Status
```sql
SELECT 
    id,
    slug,
    title,
    status,
    expires_at,
    CASE 
        WHEN status = 'active' AND (expires_at IS NULL OR expires_at > NOW()) 
        THEN '✅ VISIBLE TO PUBLIC'
        ELSE '❌ HIDDEN FROM PUBLIC'
    END as public_visibility,
    created_at
FROM urgent_requirements
ORDER BY created_at DESC;
```

### Check Countries Status
```sql
SELECT 
    slug,
    name,
    is_active,
    CASE 
        WHEN is_active = true THEN '✅ VISIBLE'
        ELSE '❌ HIDDEN'
    END as visibility
FROM countries
ORDER BY sort_order;
```

### Manually Toggle Status
```sql
-- Hide an urgent requirement
UPDATE urgent_requirements 
SET status = 'closed' 
WHERE slug = 'test-uk-nurses';

-- Show it again
UPDATE urgent_requirements 
SET status = 'active' 
WHERE slug = 'test-uk-nurses';

-- Hide a country
UPDATE countries 
SET is_active = false 
WHERE slug = 'germany';

-- Show a country
UPDATE countries 
SET is_active = true 
WHERE slug = 'germany';
```

## ✅ Success Checklist

- [ ] Admin login works
- [ ] Can create urgent requirements
- [ ] Eye icon toggles to EyeOff and back
- [ ] Toast notifications appear on toggle
- [ ] Hidden urgent requirements DON'T show on public page
- [ ] Active urgent requirements DO show on public page
- [ ] Can toggle country visibility
- [ ] Hidden countries DON'T show on public page
- [ ] Active countries DO show on public page
- [ ] No console errors
- [ ] No 404 errors in Network tab

## 📊 Expected Behavior Summary

| Action | Admin Panel | Public Page | Database |
|--------|------------|-------------|----------|
| Create Active | Shows with Eye 👁️ | Visible | status='active' |
| Click Eye | Changes to EyeOff 🚫👁️ | Disappears on refresh | status='closed' |
| Click EyeOff | Changes to Eye 👁️ | Appears on refresh | status='active' |
| Delete | Removed from list | Disappears | Row deleted |

## 🎯 Key Points

1. **Public users** can ONLY see items where:
   - Urgent Requirements: `status = 'active' AND not expired`
   - Countries: `is_active = true`

2. **Admin users** can see ALL items regardless of status

3. **Cache is cleared** automatically when you toggle status

4. **Refresh required** on public page to see changes (automatic cache update)

## 🔗 Quick Links

- Admin Urgent: `http://localhost:5001/admin/urgent-requirements`
- Public Urgent: `http://localhost:5001/urgent-requirements`
- Admin Countries: `http://localhost:5001/admin/countries`
- Public Countries: `http://localhost:5001/countries`
- Supabase Dashboard: `https://supabase.com/dashboard/project/ugvtrtlnufzkjgxhucji`

---

**Last Updated:** August 31, 2026  
**Status:** Ready for Testing
