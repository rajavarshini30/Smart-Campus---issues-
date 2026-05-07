'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Users, ChevronRight, Wifi } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import BottomNav from '@/components/BottomNav'
import StatusBadge from '@/components/StatusBadge'
import { toast } from 'sonner'

interface Issue {
  id: string
  ticket_id: string
  issue_type: string
  block: string
  room: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  assigned_to?: string | null
}

interface Technician {
  id: string
  full_name: string
  email: string
}

export default function AdminDashboardPage() {
  const { profile } = useAuth()
  const [issues, setIssues] = useState<Issue[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return

    function fetchData() {
      // Fetch all issues for this university
      supabase
        .from('issues')
        .select('*')
        .eq('university_id', profile!.university_id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setIssues((data as Issue[]) ?? [])
          setLoading(false)
        })

      // Fetch technicians
      supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('university_id', profile!.university_id)
        .eq('role', 'technician')
        .then(({ data }) => setTechnicians((data as Technician[]) ?? []))
    }

    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [profile])

  async function assignTechnician(issueId: string, techId: string) {
    setAssigning(issueId)
    const { error } = await supabase.from('issues').update({ assigned_to: techId } as never).eq('id', issueId)
    if (error) toast.error('Failed to assign')
    else toast.success('Technician assigned!')
    setAssigning(null)
  }

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === 'pending').length,
    in_progress: issues.filter((i) => i.status === 'in_progress').length,
    completed: issues.filter((i) => i.status === 'completed').length,
  }

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'In Progress', value: stats.in_progress, color: '#3B82F6' },
    { name: 'Completed', value: stats.completed, color: '#22C55E' },
  ].filter((d) => d.value > 0)

  const statCards = [
    { label: 'Total', value: stats.total, icon: ClipboardList, gradient: 'grad-blue' },
    { label: 'Pending', value: stats.pending, icon: AlertCircle, gradient: 'grad-orange' },
    { label: 'In Progress', value: stats.in_progress, icon: Clock, gradient: 'grad-blue' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, gradient: 'grad-green' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="grad-blue px-5 pt-12 pb-6 rounded-b-3xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs">9:41</span>
          <Wifi size={11} className="text-white/60" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-white/60 text-sm">Admin Dashboard</p>
            <h1 className="text-2xl font-black text-white">Overview 📊</h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
        </div>
        <div className="absolute top-[-30px] right-[-30px] w-24 h-24 rounded-full bg-white/5" />
      </div>

      {/* Stat cards */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {statCards.map(({ label, value, icon: Icon, gradient }) => (
          <div key={label} className={`${gradient} rounded-3xl p-4 shadow-lg`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-xs font-semibold">{label}</p>
              <Icon size={16} className="text-white/70" />
            </div>
            <p className="text-3xl font-black text-white">{loading ? '–' : value}</p>
          </div>
        ))}
      </div>

      {/* Pie chart */}
      {!loading && pieData.length > 0 && (
        <div className="mx-4 mt-4 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Complaints Overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v, '']} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text overlay */}
          <div className="text-center -mt-2">
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-400">Total Issues</p>
          </div>
        </div>
      )}

      {/* Recent issues */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Recent Issues</p>
          <span className="text-xs text-blue-600 font-semibold">Live 🔴</span>
        </div>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)
          ) : (
            issues.slice(0, 10).map((issue) => (
              <div key={issue.id} id={`admin-issue-${issue.id}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-xs font-black text-blue-600 font-mono">{issue.ticket_id}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5 leading-tight">{issue.issue_type}</p>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {issue.block} – {issue.room}</p>
                  </div>
                  <StatusBadge status={issue.status} assignedTo={issue.assigned_to} />
                </div>

                {/* Assign technician */}
                {!issue.assigned_to && issue.status === 'pending' && technicians.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    <select
                      id={`assign-select-${issue.id}`}
                      className="flex-1 text-xs border border-gray-200 rounded-xl px-2 py-1.5 bg-gray-50 text-gray-700"
                      onChange={(e) => {
                        if (e.target.value) assignTechnician(issue.id, e.target.value)
                      }}
                      defaultValue=""
                    >
                      <option value="">Assign Technician…</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>{t.full_name}</option>
                      ))}
                    </select>
                    {assigning === issue.id && (
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                )}

                {issue.assigned_to && (
                  <div className="flex items-center gap-1 mt-1">
                    <ChevronRight size={12} className="text-gray-400" />
                    <p className="text-[11px] text-gray-400">Assigned to technician</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
