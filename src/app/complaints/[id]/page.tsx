'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Clock, Hash, Layers, AlertTriangle, User, Wifi } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import StatusBadge from '@/components/StatusBadge'

interface Issue {
  id: string
  ticket_id: string
  issue_type: string
  block: string
  room: string
  section: string
  description: string
  image_url: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  assigned_to?: string | null
  profiles?: { full_name: string } | null
}

export default function ComplaintDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function fetchIssue() {
      supabase
        .from('issues')
        .select('*, profiles!assigned_to(full_name)')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          setIssue(data as unknown as Issue)
          setLoading(false)
        })
    }

    fetchIssue()
    const interval = setInterval(fetchIssue, 15000)
    return () => clearInterval(interval)
  }, [id])

  const priorityConfig = {
    low: { label: 'Low', color: 'text-green-600 bg-green-50', icon: '🟢' },
    medium: { label: 'Medium', color: 'text-blue-600 bg-blue-50', icon: '🔵' },
    high: { label: 'High', color: 'text-red-600 bg-red-50', icon: '🔴' },
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="grad-blue h-40 rounded-b-3xl animate-pulse" />
        <div className="px-4 mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-14 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!issue) return null

  const pc = priorityConfig[issue.priority]
  const detailRows = [
    { icon: Hash, label: 'Ticket ID', value: issue.ticket_id, mono: true },
    { icon: MapPin, label: 'Block & Room', value: `${issue.block} – ${issue.room}` },
    { icon: Layers, label: 'Section', value: issue.section },
    { icon: AlertTriangle, label: 'Issue Type', value: issue.issue_type },
    { icon: Clock, label: 'Date & Time', value: new Date(issue.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    ...(issue.profiles ? [{ icon: User, label: 'Assigned To', value: issue.profiles.full_name }] : []),
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="grad-blue px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs">9:41</span>
          <Wifi size={11} className="text-white/60" />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Complaint Details</h1>
            <p className="text-white/60 text-xs font-mono">{issue.ticket_id}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Status card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Status</p>
            <StatusBadge status={issue.status} assignedTo={issue.assigned_to} />
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${pc.color}`}>
            {pc.icon} {pc.label} Priority
          </div>
        </div>

        {/* Image */}
        {issue.image_url && (
          <div className="overflow-hidden rounded-3xl shadow-sm">
            <img src={issue.image_url} alt="Issue" className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Description</p>
          <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>
        </div>

        {/* Detail rows */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-3">
          {detailRows.map(({ icon: Icon, label, value, mono }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                <p className={`text-sm font-semibold text-gray-800 mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Progress Timeline</p>
          {(['pending', 'in_progress', 'completed'] as const).map((s, idx) => {
            const statusOrder = ['pending', 'in_progress', 'completed']
            const currentIdx = statusOrder.indexOf(issue.status)
            const done = idx <= currentIdx
            return (
              <div key={s} className="flex items-center gap-3 mb-2 last:mb-0">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${done ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                  {done && <span className="text-white text-[10px]">✓</span>}
                </div>
                <p className={`text-xs font-semibold capitalize ${done ? 'text-gray-800' : 'text-gray-400'}`}>
                  {s.replace('_', ' ')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
