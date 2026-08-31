import { useAuth } from '@/hooks/use-auth'
import type { RoleSlug } from '@/lib/rbac'

type RoleGuardProps = {
  roles: RoleSlug[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleGuard({ roles, fallback = null, children }: RoleGuardProps) {
  const { roleSlug } = useAuth()

  if (roles.includes(roleSlug)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
