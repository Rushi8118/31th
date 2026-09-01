# 📅 Quick Reference: Edit Deadline Feature

## Where to Find It

**Admin Panel:** http://localhost:5001/admin/urgent-requirements

---

## Quick Steps

### Edit Existing Deadline:

1. Click **pencil icon (✏️)** on requirement
2. Scroll to **"Custom Expiration Date"** field
3. Click date field → pick new date
4. Click **"Save & Publish"**
5. Done! ✅

### Create with Specific Date:

1. Click **"+ Add Urgent Requirement"**
2. Fill in title, country, etc.
3. Pick date in **"Custom Expiration Date"** field
4. Click **"Save & Publish"**
5. Done! ✅

---

## Two Options

| Option | When to Use | Example |
|--------|------------|---------|
| **Duration Days** | Auto-calculate from today | Set 14 → expires in 14 days |
| **Custom Date** | Specific deadline | Pick Mar 15 → expires Mar 15 |

---

## Field Location in Form

```
Title: [........................]
Country: [Select ▼]
Category: [Healthcare] Vacancies: [15] Duration: [14] ← can disable

📅 Custom Expiration Date (Optional) ⭐ NEW
[2026-03-15 📅] ← Pick specific date here

Salary: [........................]
```

---

## Important Notes

⚠️ **Only one method works at a time:**
- Set custom date → duration disabled
- Clear date → duration re-enabled

⚠️ **Date must be future:**
- Cannot pick yesterday
- Can pick today or later

✅ **Works on mobile:**
- Shows native date picker
- Touch-friendly

---

## Example Use Cases

### Extend deadline by 1 week:
Current: Feb 10 → Pick: Feb 17

### Make urgent (tomorrow):
Current: 14 days → Pick: Tomorrow

### Set exact deadline:
Current: 30 days → Pick: Mar 1, 2026

---

## Troubleshooting

**Q: Date picker doesn't show?**  
A: Use modern browser (Chrome 90+, Firefox 88+, Edge 90+)

**Q: Changes don't save?**  
A: Check browser console for errors, verify date is future

**Q: Public page doesn't update?**  
A: Clear cache: `localStorage.clear(); location.reload();`

---

## Files Modified

- `src/pages/admin/UrgentRequirementsAdminPage.tsx`

## Documentation

- 📄 `DATE_PICKER_ADDED.md` - Technical details
- 📄 `HOW_TO_EDIT_DEADLINE.md` - Full user guide
- 📄 `TASK_6_COMPLETE.md` - Implementation summary

---

**Feature is READY to use! 🎉**
