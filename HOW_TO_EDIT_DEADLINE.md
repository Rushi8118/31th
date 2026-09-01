# 📅 How to Edit Deadline/Expiration Date

## Quick Guide for Admin Users

---

## Method 1: Edit Existing Requirement's Deadline

### Step-by-Step:

1. **Go to Admin Panel**
   ```
   http://localhost:5001/admin/urgent-requirements
   ```

2. **Find the requirement** you want to edit in the list

3. **Click the Pencil (✏️) icon** on that requirement

4. **Modal opens with form** - Scroll to the date fields

5. **You'll see TWO options:**

   **Option A: Timeline Duration (Days to show)**
   - Shows number of days (e.g., 14)
   - If you want to extend by days, change this number
   - Example: Change 14 → 30 (extends by 16 days)

   **Option B: Custom Expiration Date (Optional)** ⭐ NEW
   - Click the date input field
   - Calendar picker opens
   - Pick the exact deadline date
   - When set, the Duration Days field becomes disabled

6. **Click "Save & Publish"**

7. **Verify:**
   - Check the "Deadline" column in admin list
   - Check the public page: http://localhost:5001/urgent-requirements
   - Countdown should reflect your new date

---

## Method 2: Create New Requirement with Specific Date

### Step-by-Step:

1. **Click "+ Add Urgent Requirement"** button

2. **Fill in basic info:**
   - Title
   - Country
   - Category
   - Vacancies
   - Salary
   - etc.

3. **Set Deadline** - Choose ONE method:

   **Auto-Calculate (Traditional Way):**
   - Set "Timeline Duration" = 30 days
   - Leave "Custom Expiration Date" empty
   - System calculates: Today + 30 days

   **Manual Date (New Way):** ⭐
   - Click "Custom Expiration Date" field
   - Pick date from calendar (e.g., March 15, 2026)
   - "Timeline Duration" becomes disabled
   - Your exact date is used

4. **Complete the form** (summary, content, etc.)

5. **Click "Save & Publish"**

---

## Example Scenarios

### Scenario 1: Extend deadline by 2 weeks
**Before:** Expires Feb 10, 2026  
**Action:** Edit → Set Custom Date to Feb 24, 2026  
**Result:** Extended by 14 days  

### Scenario 2: Make it expire tomorrow
**Before:** Expires March 1, 2026  
**Action:** Edit → Set Custom Date to tomorrow's date  
**Result:** Expires tomorrow  

### Scenario 3: Switch from days to date
**Before:** Using 14 days duration  
**Action:** Edit → Pick March 20, 2026 in date picker  
**Result:** Ignores duration, uses March 20  

### Scenario 4: Switch from date to days
**Before:** Using March 20, 2026  
**Action:** Edit → Clear date field → Set duration to 30  
**Result:** Uses 30 days from today  

---

## Visual Form Layout

```
┌─────────────────────────────────────────────────────┐
│  Requirement Title *                                │
│  [Enter title here............................]     │
├─────────────────────────────────────────────────────┤
│  URL Slug *              Country *                  │
│  [slug-here.......]     [Select Country ▼]         │
├─────────────────────────────────────────────────────┤
│  Category *      Vacancies *    Timeline Duration * │
│  [Healthcare]   [15]            [14] days          │
│                                  ↑ Disabled if date set
├─────────────────────────────────────────────────────┤
│  📅 Custom Expiration Date (Optional) ⭐ NEW        │
│  [📅 Pick a date.....................]              │
│  💡 Leave empty to use duration days, or pick       │
│     a specific deadline date                        │
├─────────────────────────────────────────────────────┤
│  Salary / Package *                                 │
│  [£24,500 - £28,000 / year........................] │
└─────────────────────────────────────────────────────┘
```

---

## Important Notes

⚠️ **Date vs Duration:**
- You can only use ONE method at a time
- Setting custom date → Duration field disabled
- Changing duration → Custom date cleared

⚠️ **Validation:**
- Cannot pick dates in the past
- Date must be today or future
- If validation fails, error toast appears

⚠️ **Browser Support:**
- Modern browsers show native date picker
- Mobile devices show native date selector
- All major browsers supported (Chrome, Firefox, Edge, Safari)

---

## Troubleshooting

### ❌ Problem: Date picker doesn't show
**Solution:** Make sure you're using a modern browser (Chrome 90+, Firefox 88+, Edge 90+)

### ❌ Problem: Date doesn't save
**Solution:** 
1. Check browser console for errors
2. Verify date is not in the past
3. Ensure you clicked "Save & Publish"

### ❌ Problem: Duration days still showing
**Solution:** Clear the custom date field first, then duration days re-enables

### ❌ Problem: Public page doesn't reflect new date
**Solution:**
1. Clear cache: `localStorage.clear(); location.reload();`
2. Check database: `expires_at` column should have your date
3. Verify status is 'active'

---

## Database Field

The date is stored as:
- **Column:** `expires_at`
- **Type:** `timestamptz` (timestamp with timezone)
- **Format:** ISO 8601 (e.g., `2026-03-15T00:00:00Z`)

---

## Summary

✅ **Added:** Custom expiration date picker  
✅ **Location:** Admin form, after Duration Days field  
✅ **Behavior:** Overrides duration when set  
✅ **Validation:** Prevents past dates  
✅ **Flexible:** Switch between duration and date anytime  

**You can now set specific deadlines for urgent requirements! 🎉**
