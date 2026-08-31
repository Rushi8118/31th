import { useAuth } from './use-auth'
import { useCallback } from 'react'
import {
  hasAnyPermission,
  hasAllPermissions,
  getPermissionModule,
  type PermissionSlug,
} from '@/lib/rbac'

type PermissionsInfo = {
  permissions: string[]
  can: (permission: PermissionSlug) => boolean
  canAny: (permissions: PermissionSlug[]) => boolean
  canAll: (permissions: PermissionSlug[]) => boolean
  module: (key: string) => string
}

export function usePermissions(): PermissionsInfo {
  const { permissions, hasPermission } = useAuth()

  const can = useCallback(
    (permission: PermissionSlug) => hasPermission(permission),
    [hasPermission]
  )

  const canAny = useCallback(
    (perms: PermissionSlug[]) => hasAnyPermission(permissions, perms),
    [permissions]
  )

  const canAll = useCallback(
    (perms: PermissionSlug[]) => hasAllPermissions(permissions, perms),
    [permissions]
  )

  return {
    permissions,
    can,
    canAny,
    canAll,
    module: getPermissionModule,
  }
}
