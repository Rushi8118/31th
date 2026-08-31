import React, { useState } from 'react'
import { useAppointments, Appointment } from '@/hooks/useAppointments'
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  UserCheck,
  XCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function AppointmentsPage() {
  const { appointments, bookAppointment, bookLoading, cancelAppointment } = useAppointments()
  
  // Selection states
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [meetingType, setMeetingType] = useState<'Video Call' | 'In-Person' | 'Phone Call'>('Video Call')
  const [notes, setNotes] = useState<string>('')
  
  // Cancel prompt modal target
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null)

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return
    if (!selectedSlot) return

    bookAppointment(
      {
        type: meetingType,
        date: new Date(selectedDate),
        timeSlot: selectedSlot,
        notes: notes,
      },
      {
        onSuccess: () => {
          setSelectedDate('')
          setSelectedSlot('')
          setNotes('')
        },
      }
    )
  }

  // Split appointments into upcoming and past
  const upcoming = appointments.filter(
    (a) => a.status === 'Scheduled' && new Date(a.scheduled_at) > new Date()
  )

  const history = appointments.filter(
    (a) => a.status !== 'Scheduled' || new Date(a.scheduled_at) <= new Date()
  )

  const getMeetingTypeIcon = (type: Appointment['appointment_type']) => {
    switch (type) {
      case 'Video Call':
        return <Video className="h-4.5 w-4.5 text-blue-500" />
      case 'Phone Call':
        return <Phone className="h-4.5 w-4.5 text-emerald-500" />
      default:
        return <UserCheck className="h-4.5 w-4.5 text-[#C49A2B]" />
    }
  }

  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Booking Calendar Flow */}
        <div className="lg:col-span-7 bg-card border border-border/50 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-base font-bold text-[#1a1a2e] border-b border-border/30 pb-3">
            Schedule a Consultation
          </h3>

          <form onSubmit={handleBook} className="space-y-5.5">
            {/* Step 1: Select Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase">1. Choose Date</label>
              <input
                type="date"
                required
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Min tomorrow
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-10 px-3.5 text-xs font-semibold rounded-xl border border-border/60 bg-[#F5F0E8]/20 focus:border-[#C49A2B]/40 focus:outline-none"
              />
            </div>

            {/* Step 2: Select Time Slot */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase">2. Select Hour Slot</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 text-[11px] font-bold rounded-xl border transition ${
                      selectedSlot === slot
                        ? 'bg-[#1a1a2e] border-[#1a1a2e] text-[#F5F0E8] shadow-sm'
                        : 'bg-card border-border/65 text-[#1a1a2e] hover:border-[#C49A2B]/35 hover:bg-[#F5F0E8]/25'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Select Consultation Medium */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase">3. Meeting Channel</label>
              <div className="grid grid-cols-3 gap-2.5">
                {([
                  { label: 'Video Call', icon: Video, color: 'text-blue-500' },
                  { label: 'Phone Call', icon: Phone, color: 'text-emerald-500' },
                  { label: 'In-Person', icon: UserCheck, color: 'text-[#C49A2B]' },
                ] as const).map((medium) => {
                  const Icon = medium.icon
                  return (
                    <button
                      key={medium.label}
                      type="button"
                      onClick={() => setMeetingType(medium.label)}
                      className={`py-3 px-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center ${
                        meetingType === medium.label
                          ? 'border-[#C49A2B] bg-[#C49A2B]/5 font-semibold text-[#1a1a2e]'
                          : 'bg-card border-border/65 text-muted-foreground hover:text-[#1a1a2e] hover:border-[#C49A2B]/30'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${medium.color}`} />
                      <span className="text-[10px]">{medium.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step 4: Describe queries */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase">4. Description Notes</label>
              <Textarea
                placeholder="Mention any specific queries regarding destination studies or work visa approvals..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs h-20 border-border/60 bg-[#F5F0E8]/20 focus:border-[#C49A2B]/40 resize-none rounded-xl"
              />
            </div>

            {/* Book Trigger Button */}
            <Button
              type="submit"
              disabled={bookLoading || !selectedDate || !selectedSlot}
              className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 btn-glow h-10.5 text-xs font-bold"
            >
              Confirm Booking Slot
            </Button>
          </form>
        </div>

        {/* Right Side: Appointment lists */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Section */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1a1a2e] border-b border-border/30 pb-3">
              Upcoming Sessions
            </h3>

            {upcoming.length === 0 ? (
              <div className="py-10 text-center bg-[#F5F0E8]/10 rounded-xl border border-dashed border-border/60">
                <Clock className="h-8 w-8 text-muted-foreground/35 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground font-semibold">No active sessions booked</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Use the adjacent scheduler to claim a calendar slot.</p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {upcoming.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3.5 rounded-xl border border-border/50 bg-[#F5F0E8]/15 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-[#1a1a2e]/5 shrink-0">
                          {getMeetingTypeIcon(appt.appointment_type)}
                        </span>
                        <span className="text-[10px] font-bold text-[#1a1a2e]">
                          {appt.appointment_type}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground leading-tight space-y-0.5">
                        <p className="font-semibold text-[#1a1a2e]">
                          Date: {new Date(appt.scheduled_at).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="font-medium">
                          Time: {new Date(appt.scheduled_at).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })} ({appt.duration_minutes} mins)
                        </p>
                      </div>
                      {appt.notes && (
                        <p className="text-[10px] text-muted-foreground italic truncate">
                          &ldquo;{appt.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Action trigger button */}
                    <button
                      onClick={() => setCancelTargetId(appt.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 rounded-full hover:bg-red-50 shrink-0 transition"
                      aria-label="Cancel Slot"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past History Section */}
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1a1a2e] border-b border-border/30 pb-3">
              Consultation Log History
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                No past consultations recorded.
              </p>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {history.slice(0, 5).map((appt) => (
                  <div
                    key={appt.id}
                    className="flex justify-between items-center text-xs py-2 border-b border-border/30 gap-3"
                  >
                    <div className="leading-tight space-y-0.5">
                      <h4 className="font-semibold text-[#1a1a2e]">
                        {appt.appointment_type}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(appt.scheduled_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-bold border rounded-full px-2 py-0.5 ${
                        appt.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : appt.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {appt.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Double-Check Cancellation Modal popup overlay */}
      {cancelTargetId && (
        <div className="fixed inset-0 bg-[#1a1a2e]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4">
            <div className="p-3 bg-red-100 text-red-500 rounded-full inline-flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#1a1a2e]">Cancel Appointment?</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                This action is permanent and frees up this calendar slot for other visa applicants.
              </p>
            </div>
            <div className="flex gap-3.5 pt-2">
              <Button
                variant="outline"
                onClick={() => setCancelTargetId(null)}
                className="flex-1 rounded-xl h-10 text-xs font-semibold"
              >
                No, Keep it
              </Button>
              <Button
                onClick={() => {
                  cancelAppointment(cancelTargetId)
                  setCancelTargetId(null)
                }}
                className="flex-1 rounded-xl h-10 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Cancel Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
