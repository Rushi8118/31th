/**
 * Audit Log helper for recording user actions
 * Uses the write_audit_log RPC function on the backend
 */

import { supabase } from './supabase/client'
import { logger } from './logger'

type AuditAction =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.role_changed'
  | 'user.suspended'
  | 'user.activated'
  | 'role.created'
  | 'role.updated'
  | 'role.deleted'
  | 'permission.assigned'
  | 'permission.revoked'
  | 'application.created'
  | 'application.updated'
  | 'application.status_changed'
  | 'application.deleted'
  | 'application.assigned'
  | 'document.uploaded'
  | 'document.verified'
  | 'document.deleted'
  | 'payment.created'
  | 'payment.refunded'
  | 'settings.updated'
  | 'blog.created'
  | 'blog.published'
  | 'blog.updated'
  | 'blog.deleted'
  | 'customer.created'
  | 'customer.updated'
  | 'lead.created'
  | 'lead.updated'
  | 'appointment.created'
  | 'appointment.updated'
  | 'appointment.cancelled'
  | 'login'
  | 'logout'
  | 'export'
  | 'system.config_change'
  | string

type Severity = 'info' | 'warning' | 'critical'

type AuditLogParams = {
  action: AuditAction
  resource: string
  resourceId?: string
  oldValue?: unknown
  newValue?: unknown
  severity?: Severity
}

export async function writeAuditLog(params: AuditLogParams): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('write_audit_log', {
      p_action: params.action,
      p_resource: params.resource,
      p_resource_id: params.resourceId ?? null,
      p_old_value: params.oldValue ?? null,
      p_new_value: params.newValue ?? null,
      p_severity: params.severity ?? 'info',
    })

    if (error) {
      logger.warn('write_audit_log RPC failed:', error.message)
      return null
    }

    return data as string
  } catch (err) {
    logger.warn('Error writing audit log:', err)
    return null
  }
}

export async function auditAction(
  action: AuditAction,
  resource: string,
  newValue?: unknown,
  oldValue?: unknown,
): Promise<void> {
  await writeAuditLog({
    action,
    resource,
    newValue,
    oldValue,
  })
}
