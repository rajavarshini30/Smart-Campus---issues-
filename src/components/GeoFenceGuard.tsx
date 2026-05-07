'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapPin, RefreshCw, X, AlertTriangle } from 'lucide-react'
import { getUserLocation, isInsideCampus } from '@/lib/geo-fence'
import { UNIVERSITIES } from '@/lib/universities'

interface GeoFenceGuardProps {
  universityId: string
  onAllowed: () => void
  onDenied?: () => void
}

type GeoState = 'checking' | 'allowed' | 'denied' | 'error'

export default function GeoFenceGuard({ universityId, onAllowed, onDenied }: GeoFenceGuardProps) {
  const [geoState, setGeoState] = useState<GeoState>('checking')
  const [distance, setDistance] = useState<number | null>(null)

  const university = UNIVERSITIES.find((u) => u.id === universityId)

  const checkLocation = useCallback(async () => {
    setGeoState('checking')
    try {
      const pos = await getUserLocation()
      const { latitude: userLat, longitude: userLng } = pos.coords
      if (!university) {
        setGeoState('error')
        return
      }
      const inside = isInsideCampus(userLat, userLng, university.lat, university.lng, university.radius_meters)
      if (inside) {
        setGeoState('allowed')
        onAllowed()
      } else {
        // Calculate approximate distance
        const { getDistanceMeters } = await import('@/lib/geo-fence')
        const dist = getDistanceMeters(userLat, userLng, university.lat, university.lng)
        setDistance(Math.round(dist))
        setGeoState('denied')
        onDenied?.()
      }
    } catch {
      setGeoState('error')
    }
  }, [university, onAllowed, onDenied])

  useEffect(() => {
    checkLocation()
  }, [checkLocation])

  if (geoState === 'allowed') return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-2xl">
        {geoState === 'checking' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MapPin className="text-blue-600" size={28} />
            </div>
            <p className="font-semibold text-gray-800">Checking Location…</p>
            <p className="text-sm text-gray-500 mt-1">Verifying you are on campus</p>
          </div>
        )}

        {geoState === 'denied' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500" size={28} />
            </div>
            <h2 className="text-center text-lg font-bold text-gray-900 mb-1">Location Restricted!</h2>
            <p className="text-center text-sm text-gray-500 mb-4">
              You are not within the campus or near the allowed region.
              Issue reporting is allowed only inside campus premises.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-3 mb-5 text-center">
              <p className="text-xs text-red-600 font-medium">
                📍 You are approximately <strong>{distance}m</strong> from campus
              </p>
              <p className="text-[11px] text-red-400 mt-0.5">You are outside the campus region</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={checkLocation}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-2xl py-3 font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
                Retry Location
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 rounded-2xl py-3 font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
                Go Back
              </button>
              <button
                onClick={() => {
                  setGeoState('allowed')
                  onAllowed()
                }}
                className="mt-2 text-xs text-blue-600 font-semibold underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                Skip Location Check (Dev Only)
              </button>
            </div>
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-6 h-0.5 bg-green-500 border-dashed border" />
                Allowed Area (Inside Campus)
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-6 h-0.5 bg-red-400 border-dashed border" />
                Restricted Area (Outside Campus)
              </div>
            </div>
          </>
        )}

        {geoState === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-amber-500" size={28} />
            </div>
            <h2 className="text-center text-lg font-bold text-gray-900 mb-1">Location Access Needed</h2>
            <p className="text-center text-sm text-gray-500 mb-5">
              Please allow location access in your browser to verify you are on campus before reporting an issue.
            </p>
            <button
              onClick={checkLocation}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-2xl py-3 font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
