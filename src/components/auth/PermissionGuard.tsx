import { useAuth } from '@/hooks/use-auth'
import type { PermissionSlug } from '@/lib/rbac'

type PermissionGuardProps = {
  permission: PermissionSlug
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (hasPermission(permission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
