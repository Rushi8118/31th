---
name: RBAC roles
description: The 7-level role hierarchy and where permission matrix lives
---

Roles (ascending): user(0) < viewer(1) < editor(2) < consultant(3) < manager(4) < admin(5) < superadmin(6)

Permission matrix is STATIC in `src/lib/rbac/index.ts` — ROLE_PERMISSIONS record.
Admin panel access requires isAdminOrAbove() (admin or superadmin).
Manager can view sessions/audit but cannot terminate or manage roles.

**Why:** Static matrix avoids DB round-trips for permission checks; DB RPC `get_my_permissions` is used for runtime overrides.
**How to apply:** When adding a new permission, add it to PERMISSION_LABELS, then to the appropriate ROLE_PERMISSIONS entries.
