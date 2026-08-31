import React, { useState } from 'react'
import { useApplications, Application } from '@/hooks/useApplications'
import {
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FlagIcon } from '@/components/flag-icon'

export default function ApplicationsPage() {
  const { applications, isLoading } = useApplications()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Completed' | 'Rejected'>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  // Filter application items
  const filtered = applications.filter((app) => {
    // 1. Search Query
    const countryName = app.countries?.name || ''
    const visaName = app.visa_programs?.name || ''
    const matchesSearch =
      countryName.toLowerCase().includes(search.toLowerCase()) ||
      visaName.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    // 2. Tab selection
    if (activeTab === 'All') return true
    if (activeTab === 'Active') {
      return ['draft', 'submitted', 'under_review'].includes(app.status)
    }
    if (activeTab === 'Completed') return app.status === 'approved'
    if (activeTab === 'Rejected') return app.status === 'rejected'

    return true
  })

  // Color mapper matching prompt requirements
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'submitted':
        return { label: 'Submitted', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' }
      case 'under_review':
        return { label: 'In Review', color: 'bg-[#C49A2B]/10 text-[#C49A2B] border-[#C49A2B]/20' }
      case 'approved':
        return { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' }
      case 'rejected':
        return { label: 'Rejected', color: 'bg-red-500/10 text-red-600 border-red-500/20' }
      case 'withdrawn':
        return { label: 'Withdrawn', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' }
      default:
        return { label: 'Draft', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' }
    }
  }

  // Derive steps for stepper timeline
  const getTimelineSteps = (app: Application) => {
    const steps = [
      { key: 'draft', label: 'File Draft', description: 'Application initialized by applicant.', done: true },
      {
        key: 'submitted',
        label: 'Submitted',
        description: 'Visa folder forwarded to case officer.',
        done: ['submitted', 'under_review', 'approved'].includes(app.status),
      },
      {
        key: 'under_review',
        label: 'Under Review',
        description: 'Documents verification under MEA guidelines.',
        done: ['under_review', 'approved'].includes(app.status),
      },
      {
        key: 'approved',
        label: 'Decision Released',
        description: app.status === 'rejected' ? 'Application was rejected.' : 'Visa successfully approved!',
        done: ['approved', 'rejected'].includes(app.status),
        failed: app.status === 'rejected',
      },
    ]
    return steps
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card border border-border/50 p-4 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by country or program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-border/60 bg-[#F5F0E8]/20 focus:border-[#C49A2B]/40"
          />
        </div>

        {/* Tab selection filters */}
        <div className="flex bg-[#F5F0E8]/50 p-1 rounded-xl border border-border/30 w-full sm:w-auto overflow-x-auto">
          {(['All', 'Active', 'Completed', 'Rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab
                  ? 'bg-[#1a1a2e] text-[#F5F0E8] shadow-sm'
                  : 'text-muted-foreground hover:text-[#1a1a2e]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-card border border-border/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-2xl border border-border/50 shadow-sm">
          <Briefcase className="h-16 w-16 text-muted-foreground/35 mx-auto mb-4" />
          <h3 className="font-serif text-base font-bold text-[#1a1a2e]">No applications found</h3>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto">
            Try adjusting your search criteria or explore our programs catalog.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const config = getStatusConfig(app.status)
            const expanded = expandedId === app.id
            const steps = getTimelineSteps(app)

            return (
              <div
                key={app.id}
                className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden hover:border-[#C49A2B]/30 hover:shadow-md transition duration-200"
              >
                {/* Core content header */}
                <div
                  onClick={() => toggleExpand(app.id)}
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl sm:text-4xl shrink-0">
                      {app.countries?.name ? <FlagIcon country={app.countries.name} className="text-2xl" /> : '✈️'}
                    </span>
                    <div className="leading-tight space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-sm sm:text-base font-bold text-[#1a1a2e]">
                          {app.countries?.name || 'Destination'}
                        </h3>
                        {app.application_id && (
                          <span className="text-[10px] text-muted-foreground bg-[#F5F0E8] px-2 py-0.5 rounded font-mono font-medium">
                            {app.application_id}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {app.visa_programs?.name || 'Visa Program'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                    <span
                      className={`text-[10px] font-bold border rounded-full px-3 py-0.5 ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <button className="p-1 rounded-full hover:bg-[#F5F0E8]/50 text-muted-foreground">
                      {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Timeline stepper */}
                {expanded && (
                  <div className="border-t border-border/40 bg-[#F5F0E8]/10 p-5 space-y-6 animate-slideDown">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs text-muted-foreground border-b border-border/40 pb-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#C49A2B] shrink-0" />
                        <span>
                          Applied date:{' '}
                          <strong className="text-[#1a1a2e]">
                            {new Date(app.created_at).toLocaleDateString()}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#C49A2B] shrink-0" />
                        <span>
                          Case Officer:{' '}
                          <strong className="text-[#1a1a2e]">
                            {app.assigned_consultant ? 'Officer Assigned' : 'Siddhivinayak Desk'}
                          </strong>
                        </span>
                      </div>
                      {app.estimated_completion && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#C49A2B] shrink-0" />
                          <span>
                            Est. Completion:{' '}
                            <strong className="text-[#1a1a2e] font-mono">
                              {new Date(app.estimated_completion).toLocaleDateString()}
                            </strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress timeline stepper */}
                    <div className="space-y-4">
                      <h4 className="font-serif text-xs font-bold text-[#1a1a2e]">
                        Immigration Status Stepper
                      </h4>
                      <div className="relative pl-6 border-l-2 border-border/70 space-y-6 py-1 ml-3">
                        {steps.map((step) => {
                          const done = step.done
                          const failed = step.failed

                          return (
                            <div key={step.key} className="relative space-y-0.5">
                              {/* Stepper Bullet */}
                              <span
                                className={`absolute -left-[32px] top-0 p-0.5 rounded-full border border-card bg-card shrink-0 transition duration-300 ${
                                  failed
                                    ? 'text-red-500'
                                    : done
                                      ? 'text-emerald-500'
                                      : 'text-muted-foreground/35'
                                }`}
                              >
                                {failed ? (
                                  <XCircle className="h-4.5 w-4.5 fill-red-100" />
                                ) : done ? (
                                  <CheckCircle2 className="h-4.5 w-4.5 fill-emerald-100" />
                                ) : (
                                  <Clock className="h-4.5 w-4.5" />
                                )}
                              </span>

                              <h5
                                className={`text-xs font-bold ${
                                  failed
                                    ? 'text-red-600'
                                    : done
                                      ? 'text-[#1a1a2e]'
                                      : 'text-muted-foreground'
                                }`}
                              >
                                {step.label}
                              </h5>
                              <p className="text-[11px] text-muted-foreground">
                                {step.description}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Notes Box */}
                    {app.consultant_notes && (
                      <div className="bg-[#C49A2B]/5 border border-[#C49A2B]/15 p-4 rounded-xl text-xs space-y-1">
                        <strong className="text-[#1a1a2e] font-bold">Advisory Notes:</strong>
                        <p className="text-muted-foreground leading-normal italic">
                          &ldquo;{app.consultant_notes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
