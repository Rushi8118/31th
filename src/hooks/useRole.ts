import { useAuth } from './use-auth'
import { getRoleBySlug, type RoleSlug } from '@/lib/rbac'

type RoleInfo = {
  slug: RoleSlug
  name: string
  description: string
  level: number
  isSystem: boolean
}

export function useRole(): RoleInfo {
  const { roleSlug } = useAuth()
  const def = getRoleBySlug(roleSlug)

  return {
    slug: roleSlug,
    name: def?.name ?? roleSlug,
    description: def?.description ?? '',
    level: def?.level ?? 0,
    isSystem: def?.isSystem ?? true,
  }
}
