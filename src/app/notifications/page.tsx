'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, ArrowLeft, Info, Wifi } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'

interface Announcement {
  id: string
  title: string
  body: string
  created_at: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return

    supabase
      .from('announcements')
      .select('*')
      .eq('university_id', profile.university_id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setAnnouncements(data as Announcement[] ?? [])
        setLoading(false)
      })
  }, [profile])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="grad-blue px-5 pt-12 pb-6 rounded-b-3xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs">9:41</span>
          <Wifi size={11} className="text-white/60" />
        </div>
        <div className="flex items-center gap-3 mt-3 relative z-10">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm transition-transform active:scale-95"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Alerts & Notices</h1>
            <p className="text-white/70 text-[11px] font-medium mt-0.5">Campus Updates</p>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute bottom-[-10px] right-20 w-16 h-16 rounded-full bg-white/5" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-5 space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse shadow-sm border border-gray-100" />
          ))
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-blue-300" />
            </div>
            <h3 className="text-gray-800 font-bold text-lg mb-1">No New Alerts</h3>
            <p className="text-gray-400 text-sm">You're all caught up with campus updates!</p>
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className="bg-white rounded-3xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-50 relative overflow-hidden group animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Highlight accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-3xl" />
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Info size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 text-sm pr-2 leading-tight">
                      {announcement.title}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full shrink-0">
                      {new Date(announcement.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1.5">
                    {announcement.body}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}
