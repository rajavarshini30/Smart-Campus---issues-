'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Plus, ClipboardList, TrendingUp, User, MapPin, ChevronRight, Wifi } from 'lucide-react'
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
    // Fetch announcements
    supabase
      .from('announcements')
      .select('*')
      .eq('university_id', profile.university_id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setAnnouncements(data ?? []))

    // Fetch issue counts
    supabase
      .from('issues')
      .select('status')
      .eq('reported_by', profile.id)
      .then(({ data }) => {
        const all = (data ?? []) as { status: string }[]
        setCounts({
          pending: all.filter((i) => i.status === 'pending').length,
          in_progress: all.filter((i) => i.status === 'in_progress').length,
          completed: all.filter((i) => i.status === 'completed').length,
        })
      })
  }, [profile])

  const quickActions = [
    {
      id: 'action-report',
      icon: Plus,
      label: 'Report Issue',
      sub: 'Report new issue',
      href: '/report',
      gradient: 'grad-blue',
    },
    {
      id: 'action-complaints',
      icon: ClipboardList,
      label: 'My Complaints',
      sub: 'View your complaints',
      href: '/complaints',
      gradient: 'grad-orange',
    },
    {
      id: 'action-track',
      icon: TrendingUp,
      label: 'Track Status',
      sub: 'Check progress',
      href: '/complaints',
      gradient: 'grad-green',
    },
    {
      id: 'action-profile',
      icon: User,
      label: 'Profile',
      sub: 'Manage account',
      href: '/profile',
      gradient: 'grad-purple',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="grad-blue px-5 pt-12 pb-8 rounded-b-3xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs">9:41</span>
          <div className="flex items-center gap-2">
            <Wifi size={11} className="text-white/60" />
            <button
              id="dashboard-notif-btn"
              onClick={() => router.push('/notifications')}
              className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Bell size={16} className="text-white" />
              {announcements.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-white/70 text-sm">Hello,</p>
            <h1 className="text-2xl font-black text-white">
              {profile?.full_name?.split(' ')[0] ?? 'Student'} 👋
            </h1>
            {university && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-white/60" />
                <p className="text-white/60 text-xs truncate max-w-[220px]">{university.name}</p>
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
            <User size={22} className="text-white" />
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex gap-3 mt-5">
          {[
            { label: 'Pending', value: counts.pending, color: 'text-amber-300' },
            { label: 'In Progress', value: counts.in_progress, color: 'text-blue-200' },
            { label: 'Completed', value: counts.completed, color: 'text-green-300' },
          ].map((s) => (
            <div key={s.label} className="flex-1 bg-white/10 rounded-2xl p-3 text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-white/60 text-[10px] font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ id, icon: Icon, label, sub, href, gradient }, index) => (
            <button
              key={id}
              id={id}
              onClick={() => router.push(href)}
              className={`${gradient} rounded-3xl p-4 text-left card-hover shadow-lg animate-slideUp`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-white font-bold text-sm">{label}</p>
              <p className="text-white/70 text-xs mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Recent Announcements
          </p>
          <button 
            onClick={() => router.push('/notifications')}
            className="text-xs text-blue-600 font-semibold"
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {announcements.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-gray-400 text-sm">No announcements yet</p>
            </div>
          ) : (
            announcements.map((a, index) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 animate-slideUp group"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Bell size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(a.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sign out */}
      <div className="px-4 mt-5">
        <button
          id="dashboard-signout"
          onClick={signOut}
          className="w-full py-3 rounded-2xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition"
        >
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
