'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Search, Wifi } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import StatusBadge from '@/components/StatusBadge'
import BottomNav from '@/components/BottomNav'

interface Issue {
  id: string
  ticket_id: string
  issue_type: string
  block: string
  room: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assigned_to?: string | null
  created_at: string
}

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed'] as const
type Filter = typeof FILTERS[number]

export default function ComplaintsPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!profile) return

    function fetchIssues() {
      supabase
        .from('issues')
        .select('*')
        .eq('reported_by', profile!.id)
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

  const filtered = issues.filter((i) => {
    const matchFilter =
      filter === 'All' ||
      (filter === 'Pending' && i.status === 'pending') ||
      (filter === 'In Progress' && i.status === 'in_progress') ||
      (filter === 'Completed' && i.status === 'completed')
    const matchSearch = !search || i.issue_type.toLowerCase().includes(search.toLowerCase()) || i.ticket_id.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const priorityColor = { low: 'bg-green-100 text-green-700', medium: 'bg-blue-100 text-blue-700', high: 'bg-red-100 text-red-700' }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="grad-blue px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs">9:41</span>
          <Wifi size={11} className="text-white/60" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">My Complaints</h1>
              <p className="text-white/60 text-xs">{issues.length} total issues</p>
            </div>
          </div>
          <button
            id="complaints-add-btn"
            onClick={() => router.push('/report')}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by type or ticket ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm text-gray-700 shadow-sm"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              id={`filter-${f.toLowerCase().replace(' ', '-')}`}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Issues list */}
      <div className="flex-1 px-4 pt-3 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-24" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-400 font-medium text-sm">No complaints found</p>
          </div>
        ) : (
          filtered.map((issue) => (
            <button
              key={issue.id}
              id={`complaint-${issue.id}`}
              onClick={() => router.push(`/complaints/${issue.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-black text-blue-600 font-mono">{issue.ticket_id}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-tight">{issue.issue_type}</p>
                </div>
                <StatusBadge status={issue.status} assignedTo={issue.assigned_to} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  📍 {issue.block} – {issue.room}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor[issue.priority]}`}>
                    {issue.priority.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-gray-400">
                    {new Date(issue.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  )
}
