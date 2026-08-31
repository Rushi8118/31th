import React, { useEffect, useState, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/usePermissions";
import {
  LayoutDashboard, Users, Briefcase, FileText, Settings,
  LogOut, Activity, Shield, Zap, Mail, MonitorSmartphone, ShieldAlert,
  ChevronLeft, ChevronRight, Menu, X, FolderOpen, Flame, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminErrorBoundary } from "@/components/AdminErrorBoundary";
import { ROLE_COLORS } from "@/lib/rbac";
import type { PermissionSlug } from "@/lib/rbac";

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermission?: PermissionSlug;
  requiredPermissions?: PermissionSlug[];
};

type NavGroup = {
  label: string;
  items: NavItem[];
  requiredPermission?: PermissionSlug;
};

const ALL_NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard",       path: "/admin",              icon: LayoutDashboard },
      { label: "Live Metrics",    path: "/admin/realtime",     icon: Activity, requiredPermission: "analytics.realtime" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Users",           path: "/admin/users",        icon: Users, requiredPermission: "users.read" },
      { label: "Roles & RBAC",   path: "/admin/roles",        icon: Shield, requiredPermission: "roles.read" },
      { label: "Applications",    path: "/admin/applications", icon: Briefcase, requiredPermission: "applications.read" },
      { label: "Urgent Openings", path: "/admin/urgent-requirements", icon: Flame },
      { label: "Countries & Eligibility", path: "/admin/countries", icon: Globe },
      { label: "Blog Posts",      path: "/admin/blog",         icon: FileText, requiredPermission: "blogs.read" },
    ],
  },
  {
    label: "Security & Logs",
    items: [
      { label: "Sessions",        path: "/admin/sessions",     icon: MonitorSmartphone },
      { label: "Audit Logs",      path: "/admin/audit",        icon: ShieldAlert, requiredPermission: "audit.read" },
    ],
  },
  {
    label: "Automation",
    items: [
      { label: "Automations",     path: "/admin/automations",  icon: Zap },
      { label: "Email Templates", path: "/admin/email-templates", icon: Mail },
    ],
  },
  {
    label: "System",
    items: [
      { label: "File Manager",    path: "/admin/files",        icon: FolderOpen },
      { label: "Settings",        path: "/admin/settings",     icon: Settings, requiredPermission: "settings.read" },
    ],
  },
];

function useFilteredNavGroups(): NavGroup[] {
  const { can } = usePermissions();

  return useMemo(() => {
    return ALL_NAV_GROUPS
      .map(group => ({
        ...group,
        items: group.items.filter(item => {
          if (item.requiredPermission) return can(item.requiredPermission);
          if (item.requiredPermissions) return item.requiredPermissions.some(p => can(p));
          return true;
        }),
      }))
      .filter(group => group.items.length > 0);
  }, [can]);
}

const AdminLayout: React.FC = () => {
  const { isAdmin, canAccessAdmin, isLoading, signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileWaitExpired, setProfileWaitExpired] = useState(false);
  const navGroups = useFilteredNavGroups();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Auth marks isLoading=false before profile hydrates — wait briefly for profile
  // so we never flash Access Denied for a valid admin session.
  useEffect(() => {
    if (!user || profile) {
      setProfileWaitExpired(false);
      return;
    }
    const timer = window.setTimeout(() => setProfileWaitExpired(true), 2500);
    return () => window.clearTimeout(timer);
  }, [user, profile]);

  const waitingForProfile = Boolean(user) && !profile && !profileWaitExpired;
  if (isLoading || waitingForProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin && !canAccessAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-2xl shadow-lg border border-border max-w-md">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You don't have permission to access this area.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = (path: string) =>
    path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path);

  const roleSlug = (profile?.user_role ?? "admin") as keyof typeof ROLE_COLORS;

  const SidebarContent = () => (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className={`shrink-0 flex items-center gap-3 p-5 border-b border-border ${collapsed ? "justify-center" : ""}`}>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-foreground truncate">Admin Panel</h1>
            <p className="text-xs text-muted-foreground truncate">Siddhivinayak Overseas</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Profile chip */}
      {!collapsed && profile && (
        <div className="shrink-0 mx-4 mt-4 p-3 bg-muted/50 rounded-xl border border-border">
          <p className="text-xs font-medium text-foreground truncate">{profile.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-xs px-1.5 py-0.5 rounded-full border capitalize ${ROLE_COLORS[roleSlug] ?? "bg-gray-100 text-gray-700"}`}>
              {profile.user_role}
            </span>
          </div>
        </div>
      )}

      {/* Nav - filtered by permissions */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="shrink-0 p-3 border-t border-border">
        <button
          onClick={handleSignOut}
          title={collapsed ? "Sign Out" : undefined}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen bg-card border-r border-border transition-all duration-200 shrink-0 overflow-hidden ${
          collapsed ? "w-[68px]" : "w-60"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col overflow-hidden transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="shrink-0 lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-semibold text-sm text-foreground">Admin Panel</span>
        </div>

        <main className="flex-1 min-h-0 p-6 lg:p-8 overflow-y-auto">
          <AdminErrorBoundary key={location.pathname}>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
