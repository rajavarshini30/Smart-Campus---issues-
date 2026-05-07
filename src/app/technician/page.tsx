'use client'

import { useEffect, useState } from 'react'
import { Wrench, Clock, CheckCircle2, Wifi, MapPin } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import StatusBadge from '@/components/StatusBadge'
import BottomNav from '@/components/BottomNav'
import { toast } from 'sonner'

interface Issue {
  id: string
  ticket_id: string
  issue_type: string
  block: string
  room: string
  section: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assigned_to?: string | null
  created_at: string
}

type Tab = 'assigned' | 'in_progress' | 'completed'

export default function TechnicianPage() {
  const { profile } = useAuth()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('assigned')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return

    function fetchIssues() {
      supabase
        .from('issues')
        .select('*')
        .eq('assigned_to', profile!.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setIssues((data as Issue[]) ?? [])
          setLoading(false)
        })
    }

    fetchIssues()
    const interval = setInterval(fetchIssues, 15000)
    return () => clearInterval(interval)
  }, [profile])

  async function updateStatus(id: string, status: 'in_progress' | 'completed') {
    setUpdating(id)
    const { error } = await supabase.from('issues').update({ status } as never).eq('id', id)
    if (error) toast.error('Failed to update')
    else toast.success(`Marked as ${status.replace('_', ' ')}`)
    setUpdating(null)
  }

  const tabs: { key: Tab; label: string; icon: React.FC<{ size: number; className: string }> }[] = [
    { key: 'assigned', label: 'Assigned', icon: Wrench },
    { key: 'in_progress', label: 'In Progress', icon: Clock },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  ]

  const filtered = issues.filter((i) =>
    tab === 'assigned' ? i.status === 'pending' :
    tab === 'in_progress' ? i.status === 'in_progress' : i.status === 'completed'
  )

  const counts = {
    assigned: issues.filter((i) => i.status === 'pending').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    completed: issues.filter((i) => i.status === 'completed').length,
  }

  const priorityColor = { low: 'bg-green-100 text-green-700', medium: 'bg-blue-100 text-blue-700', high: 'bg-red-100 text-red-700' }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="grad-blue px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs">9:41</span>
          <Wifi size={11} className="text-white/60" />
        </div>
        <h1 className="text-xl font-bold text-white mt-3">My Tasks</h1>
        <p className="text-white/60 text-sm">Hello, {profile?.full_name?.split(' ')[0] ?? 'Technician'} 🔧</p>

        {/* Summary chips */}
        <div className="flex gap-2 mt-4">
          {tabs.map(({ key, label }) => (
            <div key={key} className="flex-1 bg-white/15 rounded-xl py-2 text-center">
              <p className="text-lg font-black text-white">{counts[key]}</p>
              <p className="text-[10px] text-white/70 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-1 bg-gray-200 rounded-2xl p-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              id={`tech-tab-${key}`}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              <Icon size={14} className={tab === key ? 'text-blue-600' : 'text-gray-400'} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Task cards */}
      <div className="flex-1 px-4 pt-3 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-400 font-medium text-sm">No tasks here</p>
          </div>
        ) : (
          filtered.map((issue) => (
            <div key={issue.id} id={`task-${issue.id}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs font-black text-blue-600 font-mono">{issue.ticket_id}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-tight">{issue.issue_type}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={issue.status} assignedTo={issue.assigned_to} />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor[issue.priority]}`}>
                    {issue.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-1">
                <MapPin size={11} className="text-gray-400" />
                <p className="text-xs text-gray-500">{issue.block} – {issue.room} | {issue.section}</p>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                {new Date(issue.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

              {/* Action buttons */}
              {issue.status === 'pending' && (
                <button
                  onClick={() => updateStatus(issue.id, 'in_progress')}
                  disabled={updating === issue.id}
                  className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {updating === issue.id ? 'Updating…' : '▶ Start Working'}
                </button>
              )}
              {issue.status === 'in_progress' && (
                <button
                  onClick={() => updateStatus(issue.id, 'completed')}
                  disabled={updating === issue.id}
                  className="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {updating === issue.id ? 'Updating…' : '✓ Mark Completed'}
                </button>
              )}
              {issue.status === 'completed' && (
                <div className="w-full bg-emerald-50 text-emerald-700 text-xs font-bold py-2.5 rounded-xl text-center">
                  ✓ Completed
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}
