import { useState } from 'react'
import { useActiveSessions } from '@/hooks/useActiveSessions'
import { useAuth } from '@/hooks/use-auth'
import { Monitor, Smartphone, Tablet, MapPin, Clock, Wifi, WifiOff, Trash2, RefreshCw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { getBrowser, getOS } from '@/lib/device-fingerprint'

const DeviceIcon = ({ type }: { type: string | null }) => {
  if (type === 'Mobile') return <Smartphone className="w-5 h-5" />
  if (type === 'Tablet') return <Tablet className="w-5 h-5" />
  return <Monitor className="w-5 h-5" />
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return new Date(iso).toLocaleDateString()
}

export default function SessionsPage() {
  const { user } = useAuth()
  const { activeSessions, terminatedSessions, loading, refetch, terminateSession } = useActiveSessions()
  const [terminating, setTerminating] = useState<string | null>(null)

  const handleTerminate = async (sessionId: string) => {
    if (!user) return
    setTerminating(sessionId)
    const result = await terminateSession(sessionId, user.id)
    setTerminating(null)
    if (result.success) {
      toast.success('Session terminated successfully')
    } else {
      toast.error('Failed to terminate session')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Session Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor and control all active user sessions</p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl"><Wifi className="w-6 h-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Active Sessions</p>
            <p className="text-2xl font-bold text-foreground">{activeSessions.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-xl"><WifiOff className="w-6 h-6 text-slate-500" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Terminated</p>
            <p className="text-2xl font-bold text-foreground">{terminatedSessions.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl"><Shield className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Unique Devices</p>
            <p className="text-2xl font-bold text-foreground">
              {new Set([...activeSessions, ...terminatedSessions].map(s => s.fingerprint)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Active sessions */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-semibold text-foreground">Active Sessions</h2>
          <Badge className="ml-auto bg-green-50 text-green-700 border-green-200" variant="outline">
            {activeSessions.length} online
          </Badge>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 flex gap-4 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))
          ) : activeSessions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No active sessions</div>
          ) : activeSessions.map(session => {
            const browser = session.browser ?? getBrowser(session.user_agent ?? '')
            const os = session.os ?? getOS(session.user_agent ?? '')
            const isCurrentUser = session.user_id === user?.id
            return (
              <div key={session.id} className="p-4 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                <div className={`p-2.5 rounded-xl ${isCurrentUser ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <DeviceIcon type={session.device_type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground text-sm">{session.user_email ?? `User ${session.user_id.slice(0, 8)}`}</span>
                    {session.user_role && (
                      <Badge variant="outline" className="text-xs capitalize">{session.user_role}</Badge>
                    )}
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span>{browser} on {os}</span>
                    {session.ip_address && <span className="font-mono">{session.ip_address}</span>}
                    {session.location && (
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{session.location}</span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last seen {timeAgo(session.last_seen)}</span>
                  </div>
                </div>
                {!isCurrentUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTerminate(session.id)}
                    disabled={terminating === session.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    {terminating === session.id ? 'Terminating…' : 'Terminate'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Terminated sessions */}
      {terminatedSessions.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground text-muted-foreground">Terminated Sessions</h2>
          </div>
          <div className="divide-y divide-border">
            {terminatedSessions.map(session => {
              const browser = session.browser ?? getBrowser(session.user_agent ?? '')
              const os = session.os ?? getOS(session.user_agent ?? '')
              return (
                <div key={session.id} className="p-4 flex items-center gap-4 opacity-60">
                  <div className="p-2.5 bg-muted rounded-xl text-muted-foreground">
                    <DeviceIcon type={session.device_type} />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-foreground">{session.user_email ?? `User ${session.user_id.slice(0, 8)}`}</span>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {browser} on {os} · {session.ip_address} · Terminated {timeAgo(session.terminated_at!)}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Terminated</Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
