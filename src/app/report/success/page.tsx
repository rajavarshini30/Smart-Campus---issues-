'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, ClipboardList, Home, Share2 } from 'lucide-react'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const ticketId = params.get('ticket') ?? 'SC-0000'

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center px-6 text-center">
      {/* Success circle */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center animate-scaleIn">
          <CheckCircle size={64} className="text-emerald-500 animate-checkmark" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-xl">🎉</span>
        </div>
      </div>

      <div className="animate-fadeIn">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Issue Submitted</h1>
        <h2 className="text-xl font-black text-emerald-500 mb-3">Successfully!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your issue has been recorded. Our team will look into it as soon as possible.
        </p>
      </div>

      {/* Ticket card */}
      <div className="w-full bg-white rounded-3xl shadow-lg p-5 mb-6 animate-slideUp text-left">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Your Ticket</p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Issue Ticket', text: `Ticket ID: ${ticketId}` })
              }
            }}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"
          >
            <Share2 size={14} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <p className="text-xs text-gray-500 font-medium">Ticket ID</p>
            <p className="text-sm font-black text-gray-900 font-mono">{ticketId}</p>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <p className="text-xs text-gray-500 font-medium">Status</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <p className="text-xs text-gray-500 font-medium">Submitted</p>
            <p className="text-xs font-semibold text-gray-700">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3 animate-slideUp">
        <button
          id="success-view-complaints"
          onClick={() => router.push('/complaints')}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <ClipboardList size={18} />
          VIEW MY COMPLAINTS
        </button>
        <button
          id="success-back-home"
          onClick={() => router.push('/dashboard')}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl text-sm hover:bg-gray-200 transition"
        >
          <Home size={18} />
          BACK TO HOME
        </button>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
