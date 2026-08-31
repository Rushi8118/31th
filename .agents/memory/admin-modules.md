---
name: Admin module architecture
description: How the 6 admin feature modules are structured and their graceful degradation pattern
---

Each admin module follows a consistent pattern:
- Hook in `src/hooks/use<Feature>.ts` — fetches from Supabase, falls back to DEMO_ const on error
- Page in `src/pages/admin/<Feature>Page.tsx` — pure UI, consumes hook
- Route in `src/App.tsx` under `/admin/<path>`
- Nav entry in `src/components/AdminLayout.tsx` NAV_GROUPS array

Modules:
1. Roles & RBAC — /admin/roles — RolesPage + permission matrix
2. Session Management — /admin/sessions — SessionsPage + useActiveSessions
3. Audit Logs — /admin/audit — AuditLogsPage + useAuditLogs
4. Realtime Dashboard — /admin/realtime — RealtimeDashboardPage + useRealtimeMetrics
5. Automations — /admin/automations — AutomationsPage + useAutomations
6. Email Templates — /admin/email-templates — EmailTemplatesPage + useEmailTemplates

**Why:** Demo data pattern means all UI is visible/testable before Supabase credentials are set.
**How to apply:** When adding a new admin module, always provide a DEMO_ const as fallback in the catch block of the hook.
