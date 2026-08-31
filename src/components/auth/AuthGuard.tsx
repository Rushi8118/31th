import { useAuth } from '@/hooks/use-auth'
import { Navigate, useLocation } from 'react-router-dom'
import { Clock } from 'lucide-react'

type AuthGuardProps = {
  permission?: string
  roles?: string[]
  requireAll?: boolean
  fallback?: React.ReactNode
  redirectTo?: string
  children: React.ReactNode
}

const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <div className="relative flex flex-col items-center">
      <Clock className="h-10 w-10 text-primary animate-spin" />
      <p className="mt-4 text-sm text-muted-foreground font-semibold animate-pulse">
        Verifying authorization...
      </p>
    </div>
  </div>
)

export function AuthGuard({
  permission,
  roles,
  requireAll = false,
  fallback,
  redirectTo,
  children,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, hasPermission, roleSlug } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || `/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (roles && roles.length > 0) {
    const hasRole = roles.includes(roleSlug)
    if (!hasRole) {
      return <>{fallback}</>
    }
  }

  if (permission) {
    if (!hasPermission(permission as any)) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}
