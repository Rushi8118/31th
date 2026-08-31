import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import UserAvatar from './UserAvatar'
import {
  User,
  Briefcase,
  FileText,
  Calendar,
  Bell,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react'

export default function UserProfileDropdown() {
  const { user, profile, signOut, canAccessAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Handle outside clicks and Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!user) return null

  // Derive first name
  const displayName = profile?.first_name 
    ? profile.first_name 
    : profile?.full_name 
      ? profile.full_name.split(' ')[0] 
      : 'User'

  const handleLogout = async () => {
    setIsOpen(false)
    await signOut()
    navigate('/')
  }

  const menuItems = [
    { label: 'My Profile', path: '/dashboard/profile', icon: User },
    { label: 'My Applications', path: '/dashboard/applications', icon: Briefcase },
    { label: 'My Documents', path: '/dashboard/documents', icon: FileText },
    { label: 'My Appointments', path: '/dashboard/appointments', icon: Calendar },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  ]

  if (canAccessAdmin) {
    menuItems.unshift({ label: 'Admin Panel', path: '/admin', icon: Shield })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar + Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1 px-2.5 rounded-full border border-border/70 hover:bg-muted/50 transition duration-200 select-none group"
      >
        <UserAvatar
          imageUrl={profile?.profile_photo_url}
          fullName={profile?.full_name || user.email}
          size="sm"
        />
        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-none">
            Hi, {displayName}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition duration-200">
          {/* Top User Card info */}
          <div className="p-4 bg-muted/70 text-foreground border-b border-border">
            <p className="text-xs font-serif font-bold truncate">
              {profile?.full_name || 'Applicant Account'}
            </p>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Links list */}
          <div className="p-1.5 space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition text-left"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  {item.label}
                </button>
              )
            })}
          </div>

          <div className="border-t border-border p-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition text-left"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
