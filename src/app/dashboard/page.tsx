'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Plus, ClipboardList, TrendingUp, User, MapPin, ChevronRight, LogOut, Zap, Clock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'
import { UNIVERSITIES } from '@/lib/universities'

interface Announcement { id: string; title: string; created_at: string }

export default function DashboardPage() {
  const router = useRouter()
  const { profile, signOut } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [counts, setCounts] = useState({ pending: 0, in_progress: 0, completed: 0 })

  const university = UNIVERSITIES.find((u) => u.id === profile?.university_id)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('announcements')
      .select('*')
      .eq('university_id', profile.university_id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setAnnouncements(data ?? []))

    supabase
      .from('issues')
      .select('status')
      .eq('reported_by', profile.id)
      .then(({ data }) => {
        const all = (data ?? []) as { status: string }[]
        setCounts({
          pending:     all.filter((i) => i.status === 'pending').length,
          in_progress: all.filter((i) => i.status === 'in_progress').length,
          completed:   all.filter((i) => i.status === 'completed').length,
        })
      })
  }, [profile])

  const quickActions = [
    { id: 'action-report',     icon: Plus,          label: 'Report Issue',   sub: 'Submit a new issue',     href: '/report',      gradient: 'grad-blue'   },
    { id: 'action-complaints', icon: ClipboardList, label: 'My Complaints',  sub: 'View your reports',      href: '/complaints',  gradient: 'grad-orange' },
    { id: 'action-track',      icon: TrendingUp,    label: 'Track Status',   sub: 'Check progress',         href: '/complaints',  gradient: 'grad-green'  },
    { id: 'action-profile',    icon: User,          label: 'Profile',        sub: 'Manage account',         href: '/profile',     gradient: 'grad-purple' },
  ]

  const stats = [
    { label: 'Pending',     value: counts.pending,     color: 'text-amber-400',  bg: 'bg-amber-400/20',  icon: Clock        },
    { label: 'In Progress', value: counts.in_progress, color: 'text-sky-300',    bg: 'bg-sky-300/20',    icon: Zap          },
    { label: 'Completed',   value: counts.completed,   color: 'text-emerald-300',bg: 'bg-emerald-400/20',icon: CheckCircle2 },
  ]

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* ── Hero Header ── */}
      <div className="grad-blue px-5 pt-12 pb-10 relative overflow-hidden flex-shrink-0">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-8  -left-12  w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 right-20 w-28 h-28 rounded-full bg-white/5" />

        {/* Top bar */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-xs font-medium">Live</span>
          </div>
          <button
            id="dashboard-notif-btn"
            onClick={() => router.push('/notifications')}
            className="relative w-9 h-9 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all active:scale-95"
          >
            <Bell size={16} className="text-white" />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Greeting */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-white/60 text-sm font-medium">Good day,</p>
            <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
              {profile?.full_name?.split(' ')[0] ?? 'Student'} 👋
            </h1>
            {university && (
              <div className="flex items-center gap-1.5 mt-2 bg-white/10 rounded-full px-3 py-1 w-fit">
                <MapPin size={11} className="text-white/70" />
                <p className="text-white/80 text-xs font-medium truncate max-w-[200px]">{university.name}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="w-14 h-14 rounded-2xl bg-white/15 border-2 border-white/25 flex items-center justify-center hover:bg-white/25 transition-all active:scale-95 flex-shrink-0"
          >
            <User size={24} className="text-white" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2.5 mt-6 relative z-10">
          {stats.map(({ label, value, color, bg, icon: SIcon }) => (
            <div key={label} className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm border border-white/10">
              <div className={`w-7 h-7 rounded-xl ${bg} flex items-center justify-center mx-auto mb-1.5`}>
                <SIcon size={14} className={color} />
              </div>
              <p className={`text-xl font-black ${color}`}>{value}</p>
              <p className="text-white/55 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="px-4 mt-5 flex-shrink-0">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ id, icon: Icon, label, sub, href, gradient }, index) => (
            <button
              key={id}
              id={id}
              onClick={() => router.push(href)}
              className={`${gradient} rounded-3xl p-4 text-left card-hover shadow-lg animate-slideUp relative overflow-hidden`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 relative z-10">
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-white font-bold text-sm relative z-10">{label}</p>
              <p className="text-white/65 text-xs mt-0.5 relative z-10">{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Announcements ── */}
      <div className="px-4 mt-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Announcements
          </p>
          <button
            onClick={() => router.push('/notifications')}
            className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {announcements.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                <Bell size={18} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No announcements yet</p>
              <p className="text-gray-300 text-xs mt-0.5">Check back later</p>
            </div>
          ) : (
            announcements.map((a, index) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 flex items-center gap-3 animate-slideUp group card-hover"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bell size={15} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Sign out ── */}
      <div className="px-4 mt-5 mb-4 flex-shrink-0">
        <button
          id="dashboard-signout"
          onClick={signOut}
          className="w-full py-3 rounded-2xl border border-red-100 text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all active:scale-95"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

