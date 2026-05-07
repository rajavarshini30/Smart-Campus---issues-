'use client'

import { useRouter } from 'next/navigation'
import { User, Mail, Building2, ShieldCheck, LogOut, ChevronRight, Wifi } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import BottomNav from '@/components/BottomNav'
import { UNIVERSITIES } from '@/lib/universities'

export default function ProfilePage() {
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const university = UNIVERSITIES.find((u) => u.id === profile?.university_id)

  const roleConfig = {
    student: { label: 'Student', color: 'bg-blue-100 text-blue-700', icon: '🎓' },
    technician: { label: 'Technician', color: 'bg-orange-100 text-orange-700', icon: '🔧' },
    admin: { label: 'Administrator', color: 'bg-purple-100 text-purple-700', icon: '👑' },
  }
  const rc = profile?.role ? roleConfig[profile.role] : roleConfig.student

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="grad-blue px-5 pt-12 pb-16 rounded-b-[50px] relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs">9:41</span>
          <Wifi size={11} className="text-white/60" />
        </div>
        <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-white/5" />
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center -mt-12 z-10 px-4">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center mb-3">
          <User size={40} className="text-blue-600" />
        </div>
        <h1 className="text-xl font-black text-gray-900">{profile?.full_name ?? '—'}</h1>
        <span className={`mt-1.5 px-3 py-1 rounded-full text-xs font-bold ${rc.color}`}>
          {rc.icon} {rc.label}
        </span>
      </div>

      {/* Info cards */}
      <div className="px-4 mt-5 space-y-3">
        {[
          { icon: Mail, label: 'Email', value: profile?.email ?? '—' },
          { icon: Building2, label: 'University', value: university?.name ?? '—' },
          { icon: ShieldCheck, label: 'Role', value: rc.label },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
              <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{value}</p>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </div>
        ))}

        {/* Sign out */}
        <button
          id="profile-signout-btn"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 font-bold py-4 rounded-2xl text-sm hover:bg-red-100 transition mt-2"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
