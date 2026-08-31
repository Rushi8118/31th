import { useState } from 'react'
import { useAuditLogs } from '@/hooks/useAuditLogs'
import { Shield, AlertTriangle, Info, Search, Download, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const SEVERITY_COLORS = {
  info:     'bg-blue-50 text-blue-700 border-blue-200',
  warning:  'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
}

const SEVERITY_ICONS = {
  info:     <Info className="w-3.5 h-3.5" />,
  warning:  <AlertTriangle className="w-3.5 h-3.5" />,
  critical: <Shield className="w-3.5 h-3.5" />,
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return new Date(iso).toLocaleDateString()
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('all')
  const [page] = useState(1)

  const { logs, loading, total, refetch } = useAuditLogs({
    search: search || undefined,
    severity: severity === 'all' ? undefined : severity,
  })

  const exportCSV = () => {
    const header = 'Time,User,Role,Action,Resource,Severity,IP\n'
    const rows = logs.map(l =>
      `"${l.created_at}","${l.user_email ?? ''}","${l.user_role ?? ''}","${l.action}","${l.resource ?? ''}","${l.severity}","${l.ip_address ?? ''}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `audit-logs-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} records — who changed what and when</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch(page)} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, action, resource…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="w-36">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {(['info', 'warning', 'critical'] as const).map(sev => {
          const count = logs.filter(l => l.severity === sev).length
          return (
            <div key={sev} className={`flex items-center gap-3 p-4 rounded-xl border ${SEVERITY_COLORS[sev]}`}>
              {SEVERITY_ICONS[sev]}
              <div>
                <p className="font-semibold capitalize">{sev}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Log table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Time</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">User</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Action</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Resource</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">IP Address</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No audit logs found</td></tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{timeAgo(log.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{log.user_email ?? 'System'}</div>
                    {log.user_role && (
                      <div className="text-xs text-muted-foreground capitalize">{log.user_role}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{log.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {log.resource && <span className="font-mono text-xs">{log.resource}</span>}
                    {log.resource_id && <span className="text-xs text-muted-foreground/60 ml-1">#{log.resource_id.slice(0, 8)}</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{log.ip_address ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge className={`gap-1 border ${SEVERITY_COLORS[log.severity]}`} variant="outline">
                      {SEVERITY_ICONS[log.severity]}
                      <span className="capitalize">{log.severity}</span>
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
