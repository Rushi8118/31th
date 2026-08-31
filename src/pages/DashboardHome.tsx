import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useApplications } from '@/hooks/useApplications'
import { useDocuments } from '@/hooks/useDocuments'
import { useAppointments } from '@/hooks/useAppointments'
import { useChat } from '@/hooks/useChat'
import UserAvatar from '@/components/UserAvatar'
import {
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  ChevronRight,
  Plus,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlagIcon } from '@/components/flag-icon'

export default function DashboardHome() {
  const { user, profile } = useAuth()
  const { applications, isLoading: appsLoading } = useApplications()
  const { documents, isLoading: docsLoading } = useDocuments()
  const { appointments, isLoading: apptsLoading } = useAppointments()
  const { messages, isLoading: chatLoading } = useChat()
  const navigate = useNavigate()

  if (!user) return null

  // 1. Calculate stats
  const totalAppsCount = applications.length
  
  // Pending documents: missing documents count plus rejected documents
  const pendingDocsCount = documents.filter((d) => d.status === 'Missing' || d.status === 'Rejected').length
  
  // Next appointment scheduled date
  const upcomingAppts = appointments
    .filter((a) => a.status === 'Scheduled' && new Date(a.scheduled_at) > new Date())
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
  
  const nextApptStr = upcomingAppts.length > 0 
    ? new Date(upcomingAppts[0].scheduled_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }) + ' ' + new Date(upcomingAppts[0].scheduled_at).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'None Scheduled'

  // Unread messages count
  const unreadMessagesCount = messages.filter((m) => m.receiver_id === user.id && !m.is_read).length

  // Quick statistics items array
  const statCards = [
    {
      title: 'Total Applications',
      value: appsLoading ? '...' : totalAppsCount,
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Pending Documents',
      value: docsLoading ? '...' : pendingDocsCount,
      icon: FileText,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Next Appointment',
      value: apptsLoading ? '...' : nextApptStr,
      icon: Calendar,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Unread Messages',
      value: chatLoading ? '...' : unreadMessagesCount,
      icon: MessageSquare,
      color: 'text-[#C49A2B]',
      bgColor: 'bg-[#C49A2B]/10',
    },
  ]

  // Status Badge visual configurations
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'under_review':
        return 'bg-[#C49A2B]/10 text-[#C49A2B] border-[#C49A2B]/20'
      case 'submitted':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  // Derive recent activities from database entries
  const recentActivities = []
  if (applications.length > 0) {
    recentActivities.push({
      title: `Application initialized: ${applications[0].countries?.name || 'Visa Program'}`,
      description: `Status current: ${applications[0].status.replaceAll('_', ' ')}`,
      time: new Date(applications[0].created_at),
      icon: Briefcase,
      color: 'bg-blue-500/10 text-blue-500',
    })
  }
  if (appointments.length > 0) {
    recentActivities.push({
      title: `Meeting booked: ${appointments[0].appointment_type}`,
      description: `Status slot: ${appointments[0].status}`,
      time: new Date(appointments[0].created_at),
      icon: Calendar,
      color: 'bg-emerald-500/10 text-emerald-500',
    })
  }
  if (documents.length > 0) {
    recentActivities.push({
      title: `Document submitted: ${documents[0].name}`,
      description: `Audit status: ${documents[0].status}`,
      time: new Date(documents[0].created_at),
      icon: FileText,
      color: 'bg-amber-500/10 text-amber-500',
    })
  }

  // Sort activities
  const sortedActivities = recentActivities
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome banner Jumbotron */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1a1a2e] text-[#F5F0E8] p-6 md:p-8 border border-[#C49A2B]/15 shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <ShieldCheck className="h-64 w-64 text-[#C49A2B]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar
              imageUrl={profile?.profile_photo_url}
              fullName={profile?.full_name || user.email}
              size="lg"
              className="border-2 border-[#C49A2B]/45"
            />
            <div className="space-y-1 leading-tight">
              <h2 className="font-serif text-xl md:text-2xl font-bold">
                Welcome back, {profile?.full_name || 'Applicant'}! 👋
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage and track your global visa pathways securely under MEA guidance.
              </p>
            </div>
          </div>
          <div className="bg-[#C49A2B]/15 border border-[#C49A2B]/20 rounded-full px-4.5 py-1.5 text-xs font-semibold text-[#C49A2B] text-center">
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-card border border-border/50 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-36 hover:border-[#C49A2B]/30 hover:shadow-md transition duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold line-clamp-1">{card.title}</span>
                <span className={`p-2 rounded-xl shrink-0 ${card.bgColor} ${card.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#1a1a2e]">
                {card.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Quick Actions and timeline column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions (Desktop left span) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Applications list summary */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4.5">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <h3 className="font-serif text-base font-bold">Pathway Progress</h3>
              <button
                onClick={() => navigate('/dashboard/applications')}
                className="text-xs font-bold text-[#C49A2B] hover:underline flex items-center"
              >
                All files <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="py-8 text-center bg-[#F5F0E8]/20 rounded-xl border border-dashed border-border/60">
                <Briefcase className="h-10 w-10 text-muted-foreground/35 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-semibold">No active applications yet</p>
                <button
                  onClick={() => navigate('/countries')}
                  className="mt-3 text-xs font-bold text-[#C49A2B] hover:underline flex items-center justify-center w-full"
                >
                  Browse our target programs <ArrowRight className="h-3.5 w-3.5 ml-1.5 animate-pulse" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 hover:bg-[#F5F0E8]/25 transition"
                  >
                    <div className="flex items-center gap-3">
                      {app.countries?.name ? <FlagIcon country={app.countries.name} className="text-2xl" /> : <span className="text-2xl">✈️</span>}
                      <div className="leading-tight space-y-0.5">
                        <h4 className="text-xs font-bold text-[#1a1a2e]">
                          {app.countries?.name || 'Destination'}
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          {app.visa_programs?.name || 'Visa Program'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold border rounded-full px-2.5 py-0.5 ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {app.status.replaceAll('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold border-b border-border/30 pb-3">Quick Utilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => navigate('/dashboard/documents')}
                variant="outline"
                className="h-20 rounded-xl flex flex-col items-center justify-center text-xs font-semibold gap-1.5 border-[#C49A2B]/15 hover:bg-[#F5F0E8]/50 hover:border-[#C49A2B]/40"
              >
                <FileText className="h-5 w-5 text-amber-500" />
                Upload Document
              </Button>
              <Button
                onClick={() => navigate('/dashboard/appointments')}
                variant="outline"
                className="h-20 rounded-xl flex flex-col items-center justify-center text-xs font-semibold gap-1.5 border-[#C49A2B]/15 hover:bg-[#F5F0E8]/50 hover:border-[#C49A2B]/40"
              >
                <Plus className="h-5 w-5 text-emerald-500" />
                Book Appointment
              </Button>
              <Button
                onClick={() => navigate('/dashboard/chat')}
                variant="outline"
                className="h-20 rounded-xl flex flex-col items-center justify-center text-xs font-semibold gap-1.5 border-[#C49A2B]/15 hover:bg-[#F5F0E8]/50 hover:border-[#C49A2B]/40"
              >
                <MessageSquare className="h-5 w-5 text-[#C49A2B]" />
                Message Officer
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline (Desktop right span) */}
        <div className="lg:col-span-4 bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4.5">
          <h3 className="font-serif text-base font-bold border-b border-border/30 pb-3">Activity Logs</h3>
          
          {sortedActivities.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Clock className="h-8 w-8 text-muted-foreground/35 mb-2" />
              <p className="text-xs text-muted-foreground font-semibold">No recent logs recorded.</p>
            </div>
          ) : (
            <div className="relative pl-4 border-l-2 border-border/40 space-y-6 py-1">
              {sortedActivities.map((act, idx) => {
                const Icon = act.icon
                return (
                  <div key={idx} className="relative space-y-1">
                    {/* Circle timeline bullet */}
                    <span className={`absolute -left-[25px] top-0 p-1 rounded-full shrink-0 border border-[#F5F0E8] shadow-sm ${act.color}`}>
                      <Icon className="h-3 w-3" />
                    </span>
                    <h4 className="text-xs font-bold leading-tight text-[#1a1a2e]">
                      {act.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      {act.description}
                    </p>
                    <span className="text-[9px] text-muted-foreground/80 block mt-1">
                      {new Date(act.time).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
