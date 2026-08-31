import { useState } from 'react'
import { useRealtimeMetrics } from '@/hooks/useRealtimeMetrics'
import {
  Users, Activity, Briefcase, Clock, TrendingUp, Zap,
  RefreshCw, Wifi, WifiOff, AlertCircle, CheckCircle, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const EVENT_ICONS = {
  user_registered:      <Users className="w-3.5 h-3.5 text-blue-600" />,
  application_submitted: <Briefcase className="w-3.5 h-3.5 text-green-600" />,
  session_started:      <Wifi className="w-3.5 h-3.5 text-purple-600" />,
  error:                <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
  payment:              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
}
const EVENT_COLORS = {
  info:    'border-l-blue-400',
  warning: 'border-l-amber-400',
  error:   'border-l-red-400',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  return `${Math.floor(diff / 3600000)}h ago`
}

function StatCard({
  label, value, sub, icon: Icon, color, pulse = false,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; pulse?: boolean
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} relative`}>
          <Icon className="w-6 h-6" />
          {pulse && <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />}
        </div>
      </div>
    </div>
  )
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  )
}

const ROLE_COLORS_BAR: Record<string, string> = {
  user: 'bg-gray-400', viewer: 'bg-slate-400', editor: 'bg-blue-500',
  consultant: 'bg-teal-500', manager: 'bg-violet-500', admin: 'bg-amber-500', superadmin: 'bg-red-500',
}

export default function RealtimeDashboardPage() {
  const [refreshInterval] = useState(30000)
  const { metrics, loading, connected, refetch } = useRealtimeMetrics(refreshInterval)

  const maxRoleCount = Math.max(...metrics.usersByRole.map(r => r.count), 1)
  const maxBarValue = Math.max(...metrics.applicationsOverTime.map(p => p.value), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Real-time Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-refreshes every 30s · Last updated {new Date(metrics.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={connected
              ? 'bg-green-50 text-green-700 border-green-200 gap-1.5'
              : 'bg-red-50 text-red-600 border-red-200 gap-1.5'}
          >
            {connected
              ? <><Wifi className="w-3 h-3" /> Live</>
              : <><WifiOff className="w-3 h-3" /> Demo data</>}
          </Badge>
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Users" value={metrics.activeUsers} sub="right now"
          icon={Activity} color="bg-green-50 text-green-600" pulse />
        <StatCard label="Active Sessions" value={metrics.activeSessions} sub="open sessions"
          icon={Wifi} color="bg-blue-50 text-blue-600" />
        <StatCard label="Total Users" value={metrics.totalUsers.toLocaleString()} sub={`+${metrics.newUsersToday} today`}
          icon={Users} color="bg-violet-50 text-violet-600" />
        <StatCard label="Applications" value={metrics.totalApplications.toLocaleString()} sub={`${metrics.pendingApplications} pending`}
          icon={Briefcase} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Response" value={`${metrics.avgResponseMs}ms`} sub="server latency"
          icon={Zap} color="bg-teal-50 text-teal-600" />
        <StatCard label="Error Rate" value={`${metrics.errorRate}%`} sub="last 1h"
          icon={AlertCircle} color={metrics.errorRate > 1 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'} />
        <StatCard label="New Today" value={metrics.newUsersToday} sub="registrations"
          icon={TrendingUp} color="bg-pink-50 text-pink-600" />
        <StatCard label="Pending" value={metrics.pendingApplications} sub="need review"
          icon={Clock} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications over time */}
        <div className="bg-card border border-border rounded-2xl p-6 col-span-2">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Applications This Week
          </h2>
          <div className="flex items-end gap-2 h-32">
            {metrics.applicationsOverTime.map(point => {
              const pct = maxBarValue > 0 ? (point.value / maxBarValue) * 100 : 0
              return (
                <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{point.value}</span>
                  <div className="w-full bg-muted rounded-t-sm" style={{ height: '80px' }}>
                    <div
                      className="w-full bg-primary/70 hover:bg-primary rounded-t-sm transition-all"
                      style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{point.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Users by role */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" /> Users by Role
          </h2>
          <div className="space-y-3">
            {metrics.usersByRole.sort((a, b) => b.count - a.count).map(({ role, count }) => (
              <div key={role} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize text-foreground font-medium">{role}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <MiniBar value={count} max={maxRoleCount} color={ROLE_COLORS_BAR[role] ?? 'bg-gray-400'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live event feed */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-semibold text-foreground">Live Event Feed</h2>
          <Info className="w-4 h-4 text-muted-foreground ml-1" />
        </div>
        <div className="divide-y divide-border max-h-72 overflow-y-auto">
          {metrics.recentEvents.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">Waiting for events…</div>
          ) : metrics.recentEvents.map(ev => (
            <div
              key={ev.id}
              className={`px-6 py-3 flex items-start gap-3 hover:bg-muted/20 transition-colors border-l-4 ${EVENT_COLORS[ev.severity]}`}
            >
              <div className="mt-0.5">{EVENT_ICONS[ev.type] ?? <Info className="w-3.5 h-3.5" />}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{ev.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(ev.timestamp)}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs shrink-0 ${
                  ev.severity === 'error' ? 'text-red-600 border-red-200 bg-red-50' :
                  ev.severity === 'warning' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                  'text-blue-600 border-blue-200 bg-blue-50'
                }`}
              >
                {ev.type.replace('_', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
