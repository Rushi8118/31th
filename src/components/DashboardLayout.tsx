import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { usePermissions } from '@/hooks/usePermissions'
import UserAvatar from './UserAvatar'
import NotificationBell from './NotificationBell'
import UserProfileDropdown from './UserProfileDropdown'
import { AdminErrorBoundary } from './AdminErrorBoundary'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Shield,
  DollarSign,
  Users,
} from 'lucide-react'

type NavItem = {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  requiredPermission?: string
  showForRoles?: string[]
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut, roleSlug, canAccessAdmin } = useAuth()
  const { can } = usePermissions()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null

  const navigationItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    ]

    if (can('applications.read')) {
      items.push({ label: 'Applications', path: '/dashboard/applications', icon: Briefcase })
    }

    if (can('documents.read')) {
      items.push({ label: 'Documents', path: '/dashboard/documents', icon: FileText })
    }

    if (can('appointments.read')) {
      items.push({ label: 'Appointments', path: '/dashboard/appointments', icon: Calendar })
    }

    items.push(
      { label: 'Officer Chat', path: '/dashboard/chat', icon: MessageSquare },
      { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
      { label: 'Profile Settings', path: '/dashboard/profile', icon: Settings },
    )

    if (canAccessAdmin) {
      items.push({ label: 'Admin Panel', path: '/admin', icon: Shield })
    }

    return items
  }, [can, canAccessAdmin])

  const activeItem = navigationItems.find((item) => {
    if (item.path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(item.path)
  }) || navigationItems[0]

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const mobileItems = navigationItems.filter(
    item => !item.path.startsWith('/admin')
  ).slice(0, 5)

  return (
    <div className="h-screen w-full bg-[#F5F0E8]/40 flex flex-col md:flex-row text-[#1a1a2e] overflow-hidden">
      {/* 1. SIDEBAR (Fixed Left for Desktop) */}
      <aside
        className={`hidden md:flex flex-col h-screen bg-[#1a1a2e] text-[#F5F0E8] border-r border-[#C49A2B]/10 transition-all duration-300 relative shrink-0 overflow-hidden ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 shrink-0 flex items-center px-4.5 border-b border-[#C49A2B]/10 justify-between">
          <Link to="/" className="flex items-center gap-2 group overflow-hidden">
            <span className="h-8 w-8 rounded bg-[#C49A2B]/20 flex items-center justify-center ring-1 ring-[#C49A2B]/35">
              <Globe2 className="h-4.5 w-4.5 text-[#C49A2B]" />
            </span>
            {!collapsed && (
              <span className="font-serif font-bold text-sm text-[#F5F0E8] truncate group-hover:text-[#C49A2B] transition-colors">
                Siddhivinayak
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-4.5 -right-3 h-6 w-6 rounded-full bg-[#C49A2B] text-[#1a1a2e] border border-[#1a1a2e] flex items-center justify-center hover:scale-105 transition"
            aria-label="Collapse Menu"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* User Quick Info */}
        {!collapsed && (
          <div className="shrink-0 p-4 border-b border-[#C49A2B]/10 bg-[#1a1a2e]/40">
            <div className="flex items-center gap-3">
              <UserAvatar
                imageUrl={profile?.profile_photo_url}
                fullName={profile?.full_name || user.email}
                size="sm"
              />
              <div className="overflow-hidden flex-1 leading-tight">
                <p className="text-xs font-semibold text-[#F5F0E8] truncate">
                  {profile?.full_name || 'Applicant'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation links - dynamic based on permissions */}
        <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = item.path === '/dashboard' 
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path)

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition relative group ${
                  active
                    ? 'bg-[#C49A2B] text-[#1a1a2e] shadow-md shadow-[#C49A2B]/10 font-bold'
                    : 'text-muted-foreground hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/10'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-[#1a1a2e]' : 'text-[#C49A2B]'}`} />
                {!collapsed && <span>{item.label}</span>}
                
                {/* Tooltip on Collapsed Sidebar */}
                {collapsed && (
                  <span className="absolute left-full ml-4 px-2 py-1 bg-[#1a1a2e] text-[#F5F0E8] border border-[#C49A2B]/20 text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition z-50 pointer-events-none whitespace-nowrap shadow-lg">
                    {item.label}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="shrink-0 p-3 border-t border-[#C49A2B]/10">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0 text-red-400" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTAINER AREA */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden pb-20 md:pb-0">
        {/* Top Navbar Toolbar */}
        <header className="h-16 shrink-0 bg-[#F5F0E8]/85 backdrop-blur-xl border-b border-border/50 px-4 md:px-6 flex items-center justify-between z-40">
          {/* Mobile Logo & Page title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex md:hidden h-8 w-8 rounded bg-[#1a1a2e] items-center justify-center shrink-0">
              <Globe2 className="h-4.5 w-4.5 text-[#C49A2B]" />
            </Link>
            <h2 className="font-serif text-sm md:text-base font-semibold text-[#1a1a2e] capitalize leading-none">
              {activeItem.label}
            </h2>
          </div>

          {/* Quick Notification actions + Profile avatar */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserProfileDropdown />
          </div>
        </header>

        {/* Dynamic page content wrapped in transition container */}
        <main className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto max-w-6xl w-full mx-auto">
          <AdminErrorBoundary key={location.pathname}>
            {children}
          </AdminErrorBoundary>
        </main>
      </div>

      {/* 3. MOBILE BOTTOM TAB NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#1a1a2e] border-t border-[#C49A2B]/15 px-3 flex items-center justify-around z-40 shadow-2xl">
        {mobileItems.map((item) => {
          const Icon = item.icon
          const active = item.path === '/dashboard' 
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(item.path)

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                active ? 'text-[#C49A2B]' : 'text-muted-foreground'
              }`}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-[9px] font-medium leading-none">{item.label.split(' ')[0]}</span>
            </button>
          )
        })}
        {/* Settings icon on mobile */}
        <button
          onClick={() => navigate('/dashboard/profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            location.pathname.startsWith('/dashboard/profile') ? 'text-[#C49A2B]' : 'text-muted-foreground'
          }`}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span className="text-[9px] font-medium leading-none">Settings</span>
        </button>
      </nav>
    </div>
  )
}
