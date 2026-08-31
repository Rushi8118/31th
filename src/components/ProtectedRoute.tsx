import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import type { PermissionSlug, RoleSlug } from '@/lib/rbac'

const PageLoader = () => (
  <div className="min-h-[50vh] bg-background flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" aria-label="Loading" />
  </div>
)

const Forbidden = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center p-8 bg-card rounded-2xl shadow-lg border border-border max-w-md">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-2xl font-bold text-red-600">403</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
      <p className="text-muted-foreground mb-6">
        You do not have the required permissions to access this page.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          Go Back
        </button>
        <a
          href="/"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Home
        </a>
      </div>
    </div>
  </div>
)

type ProtectedRouteProps = {
  children: React.ReactNode
  requiredPermission?: PermissionSlug
  requiredRole?: RoleSlug
  requiredRoles?: RoleSlug[]
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
  requiredRoles,
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth()
  const { roleSlug } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader />
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Forbidden />
  }

  if (requiredRole && roleSlug !== requiredRole) {
    return <Forbidden />
  }

  if (requiredRoles && !requiredRoles.includes(roleSlug)) {
    return <Forbidden />
  }

  return <>{children}</>
}
