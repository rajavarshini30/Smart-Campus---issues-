'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronRight, Building2, Wifi } from 'lucide-react'
import { UNIVERSITIES } from '@/lib/universities'

const states = [...new Set(UNIVERSITIES.map((u) => u.state))].sort()

export default function UniversityPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')

  const filtered = useMemo(() => {
    return UNIVERSITIES.filter((u) => {
      const q = query.toLowerCase()
      const matchSearch =
        !q || u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)
      const matchState = !selectedState || u.state === selectedState
      return matchSearch && matchState
    })
  }, [query, selectedState])

  function selectUniversity(id: string) {
    localStorage.setItem('selected_university_id', id)
    router.push('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="grad-blue px-5 pt-12 pb-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs">9:41</span>
          <div className="flex items-center gap-1">
            <Wifi size={11} className="text-white/60" />
            <div className="flex gap-0.5">
              {[3, 4, 5, 6].map((h) => (
                <div key={h} className="w-0.5 bg-white/60 rounded-sm" style={{ height: h }} />
              ))}
            </div>
          </div>
        </div>
        <h1 className="text-xl font-bold text-white mt-2">Select Your University</h1>
        <p className="text-white/70 text-sm mt-0.5 mb-4">
          Search and choose your university to continue
        </p>

        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="university-search"
            type="text"
            placeholder="Search University…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl text-sm font-medium text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>
      </div>

      {/* State filter */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedState('')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !selectedState
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            All States
          </button>
          {states.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedState(s === selectedState ? '' : s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedState === s
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* University list */}
      <div className="flex-1 px-4 pt-2 pb-8 overflow-y-auto">
        <p className="text-xs text-gray-400 font-medium mb-3 px-1">
          {filtered.length} universities found
        </p>
        <div className="space-y-2">
          {filtered.map((univ) => (
            <button
              key={univ.id}
              id={`univ-${univ.id}`}
              onClick={() => selectUniversity(univ.id)}
              className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover text-left"
            >
              <div className="w-10 h-10 rounded-xl grad-blue flex items-center justify-center flex-shrink-0">
                <Building2 size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                  {univ.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-gray-400" />
                  <p className="text-xs text-gray-500 truncate">
                    {univ.city}, {univ.state}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                  {univ.lat.toFixed(4)}° N, {univ.lng.toFixed(4)}° E
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
