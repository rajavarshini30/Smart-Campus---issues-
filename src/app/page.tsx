'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Flag, Wifi } from 'lucide-react'

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/university')
    }, 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="relative w-full min-h-screen grad-blue flex flex-col items-center justify-center overflow-hidden">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-5 pt-3 pb-2">
        <span className="text-white/80 text-xs font-medium">9:41</span>
        <div className="flex items-center gap-1.5">
          <Wifi size={12} className="text-white/80" />
          <div className="flex gap-0.5">
            {[3, 4, 5, 6].map((h) => (
              <div key={h} className="w-1 bg-white/80 rounded-sm" style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>

      {/* Background circles */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-white/5" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] rounded-full bg-white/5" />
      <div className="absolute top-1/2 left-[-60px] w-[150px] h-[150px] rounded-full bg-white/5" />

      {/* Logo */}
      <div className="animate-scaleIn flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-white/15 border-2 border-white/30 flex items-center justify-center shadow-2xl">
            <div className="relative">
              <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center">
                <MapPin size={32} className="text-blue-600" fill="currentColor" />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Flag size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight mb-1">
          SMART CAMPUS
        </h1>
        <p className="text-white/70 font-medium text-sm tracking-widest mb-2">
          ISSUE REPORTING SYSTEM
        </p>
        <div className="w-16 h-0.5 bg-white/30 rounded-full mb-6" />
        <p className="text-white/80 text-base font-medium text-center leading-relaxed">
          Report. Track. Resolve.
        </p>
        <p className="text-white/50 text-xs text-center mt-1">
          Together for a better campus.
        </p>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-16 flex gap-2">
        {[0, 0.3, 0.6].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60 animate-pulse"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <p className="absolute bottom-8 text-white/40 text-xs">
        Digital Maintenance Solution
      </p>
    </div>
  )
}
