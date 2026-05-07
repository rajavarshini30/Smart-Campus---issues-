'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Sparkles, MapPin, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      const { data } = await supabase.from('profiles').select('role').single()
      const profileData = data as any
      if (profileData?.role === 'admin') router.push('/admin')
      else if (profileData?.role === 'technician') router.push('/technician')
      else router.push('/dashboard')
    }
  }

  async function handleDemoSetup() {
    setDemoLoading(true)
    try {
      const res = await fetch('/api/setup-demo', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to setup demo')
      toast.success('Demo accounts verified! You can now log in.')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[100px] animate-pulse mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px] animate-pulse mix-blend-multiply" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] right-[-20%] w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-[80px] animate-pulse mix-blend-multiply" style={{ animationDelay: '1s' }} />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Login Container */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center animate-slideUp">
        
        {/* Logo / Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.4)] mb-6 transform rotate-3">
          <MapPin size={32} className="text-white" strokeWidth={2.5} />
        </div>

        {/* Headlines */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Campus</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-2 max-w-[260px] mx-auto">
            Digital Maintenance & Issue Resolution Network
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-[340px] bg-white/60 backdrop-blur-xl p-6 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white/50">
          
          {/* Quick Fill Chips */}
          <div className="flex justify-center gap-2 mb-5">
            <button
              type="button"
              onClick={() => { setEmail('student@smartcampus.in'); setPassword('student123') }}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-[11px] font-bold transition-colors active:scale-95"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { setEmail('tech@smartcampus.in'); setPassword('tech123') }}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full text-[11px] font-bold transition-colors active:scale-95"
            >
              Tech
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@smartcampus.in'); setPassword('admin123') }}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full text-[11px] font-bold transition-colors active:scale-95"
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="University Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/80 pl-11 pr-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-900 placeholder-gray-400 border border-gray-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/80 pl-11 pr-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-900 placeholder-gray-400 border border-gray-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-2xl bg-gray-900 text-white font-bold text-sm py-4 transition-transform active:scale-95 disabled:opacity-70 mt-2"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          {/* Setup Demo Users */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center">
            <button
              onClick={handleDemoSetup}
              disabled={demoLoading}
              className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 px-4 rounded-full transition-colors active:scale-95"
            >
              <Sparkles size={14} className={demoLoading ? 'animate-spin' : ''} />
              {demoLoading ? 'Setting up...' : 'Setup Demo Accounts'}
            </button>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              <ShieldCheck size={12} />
              Secured by Geo-Fence Guard
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
