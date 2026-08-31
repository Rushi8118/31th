import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications, type Notification } from '@/hooks/useNotifications'
import {
  Bell,
  Clipboard,
  CalendarRange,
  Landmark,
  Info,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'

const TABS = ['All', 'Unread', 'Applications', 'Documents', 'Appointments', 'Chat'] as const
type Tab = (typeof TABS)[number]

function notificationIcon(type: Notification['type']) {
  switch (type) {
    case 'application_update':
      return <Clipboard className="h-5 w-5 text-[#C49A2B]" />
    case 'consultation_reminder':
      return <CalendarRange className="h-5 w-5 text-emerald-500" />
    case 'payment_due':
      return <Landmark className="h-5 w-5 text-red-500" />
    case 'document_request':
      return <Clipboard className="h-5 w-5 text-[#C49A2B]" />
    case 'promotion':
      return <Info className="h-5 w-5 text-purple-500" />
    default:
      return <Bell className="h-5 w-5 text-[#C49A2B]" />
  }
}

function matchesTab(notif: Notification, tab: Tab): boolean {
  if (tab === 'Unread') return !notif.is_read
  if (tab === 'Applications') return notif.type === 'application_update'
  if (tab === 'Documents') return notif.type === 'document_request'
  if (tab === 'Appointments') return notif.type === 'consultation_reminder'
  if (tab === 'Chat') return notif.type === 'general'
  return true
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    isError,
    refetch,
  } = useNotifications()
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const navigate = useNavigate()

  const filtered = useMemo(
    () => notifications.filter((notif) => matchesTab(notif, activeTab)),
    [notifications, activeTab],
  )

  const handleItemClick = (notif: Notification) => {
    if (!notif.is_read) markAsRead(notif.id)
    if (notif.action_url) navigate(notif.action_url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <span className="shrink-0 rounded-xl bg-[#C49A2B]/10 p-2.5 text-[#C49A2B]">
            <Bell className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-sm font-bold text-foreground">Notifications</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {unreadCount > 0 ? (
                <>
                  You have <strong className="text-[#C49A2B]">{unreadCount}</strong> unread
                </>
              ) : (
                'You are all caught up'
              )}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={() => markAllAsRead()}
            className="gap-1.5 rounded-xl bg-[#1a1a2e] text-[#F5F0E8] hover:bg-[#1a1a2e]/90"
            size="sm"
          >
            <CheckCircle className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border/30 bg-[#F5F0E8]/50 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`min-w-[76px] flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              activeTab === tab
                ? 'bg-[#1a1a2e] text-[#F5F0E8] shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isError ? (
        <div className="rounded-2xl border border-border/50 bg-card px-6 py-12 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500/70" />
          <p className="text-sm font-semibold text-foreground">Could not load notifications</p>
          <p className="mt-1 text-xs text-muted-foreground">Check your connection and try again.</p>
          <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-border/20 bg-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-card py-16 text-center shadow-sm">
          <Bell className="mx-auto mb-2 h-12 w-12 text-muted-foreground/35" />
          <p className="text-sm font-semibold text-muted-foreground">No notifications here</p>
          <p className="mt-1 text-xs text-muted-foreground">Nothing matches this filter yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <button
              key={notif.id}
              type="button"
              onClick={() => handleItemClick(notif)}
              className={`flex w-full items-start justify-between gap-4 rounded-xl border border-border/50 bg-card p-4 text-left transition hover:border-[#C49A2B]/35 hover:shadow-sm ${
                !notif.is_read ? 'border-l-2 border-l-[#C49A2B] bg-[#C49A2B]/5' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span className="shrink-0 rounded-xl bg-[#1a1a2e]/5 p-2.5">
                  {notificationIcon(notif.type)}
                </span>
                <div className="space-y-1.5">
                  <h2
                    className={`text-xs text-foreground ${!notif.is_read ? 'font-bold' : 'font-semibold'}`}
                  >
                    {notif.title}
                  </h2>
                  {notif.message && (
                    <p className="max-w-xl text-[11px] leading-normal text-muted-foreground">
                      {notif.message}
                    </p>
                  )}
                  <span className="block text-[10px] text-muted-foreground/80">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    {notif.action_label ? ` · ${notif.action_label}` : ''}
                  </span>
                </div>
              </div>
              {!notif.is_read && (
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#C49A2B]" aria-hidden />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
