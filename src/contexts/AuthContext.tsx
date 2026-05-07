'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'

interface Profile {
  id: string
  full_name: string
  email: string
  university_id: string
  role: 'student' | 'technician' | 'admin'
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data as Profile)
  }

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return
    const isPublic = ['/', '/university', '/login'].includes(pathname)
    if (!user && !isPublic) {
      router.push('/login')
    }
    // Also protect role-based routes if needed
    if (user && profile) {
      if (isPublic) {
        if (profile.role === 'admin') router.push('/admin')
        else if (profile.role === 'technician') router.push('/technician')
        else router.push('/dashboard')
      } else {
        if (pathname.startsWith('/admin') && profile.role !== 'admin') router.push('/dashboard')
        if (pathname.startsWith('/technician') && profile.role !== 'technician') router.push('/dashboard')
        // Also ensure student users don't access admin/tech pages
        if (profile.role === 'student' && (pathname.startsWith('/admin') || pathname.startsWith('/technician'))) router.push('/dashboard')
      }
    }
  }, [user, profile, loading, pathname, router])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
