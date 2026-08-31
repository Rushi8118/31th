import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { Briefcase, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const { data } = await supabase.from('applications').select('*, user_profiles!inner(*)').limit(50)
      setApplications(data ?? [])
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    submitted: 'bg-blue-100 text-blue-700',
    under_review: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="w-6 h-6" /> Applications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage visa applications</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="outline"><Filter className="w-4 h-4 mr-1" /> Filter</Button>
        <Button onClick={loadApplications} variant="outline">Refresh</Button>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Applicant</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
                <PermissionGuard permission="applications.process">
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </PermissionGuard>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No applications found</td></tr>
              ) : applications.map(app => (
                <tr key={app.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{app.application_id || app.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-foreground">{app.user_profiles?.full_name || app.user_profiles?.email || 'Unknown'}</td>
                  <td className="px-4 py-3 capitalize">{app.application_type}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[app.status] ?? ''}`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</td>
                  <PermissionGuard permission="applications.process">
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Process</Button>
                    </td>
                  </PermissionGuard>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
