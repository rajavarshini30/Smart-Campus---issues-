'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Upload, AlertTriangle, Wifi } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { generateTicketId } from '@/lib/ticket-generator'
import { UNIVERSITIES } from '@/lib/universities'
import GeoFenceGuard from '@/components/GeoFenceGuard'
import { toast } from 'sonner'

const BLOCKS = [
  'Ecole',
  'School of Management',
  'School of Law',
  'School of Education',
  'School of Media',
  'IT-1',
  'IT-2'
]

const ISSUE_TYPES = [
  'Projector Not Working',
  'AC Not Working',
  'Fan Not Working',
  'Electrical Issue',
  'Plumbing Issue',
  'Furniture Damaged',
  'Internet / Wi-Fi Issue',
  'Cleaning Required',
  'Door / Window Damaged',
  'Light Not Working',
  'Water Leakage',
  'Other'
]

export default function ReportIssuePage() {
  const router = useRouter()
  const { profile } = useAuth()
  const [geoAllowed, setGeoAllowed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    block: '',
    room: '', // Mapped to Floor
    section: '', // Mapped to Room / Area
    custom_section: '', // Used when typing manually
    issue_type: '',
    custom_issue_type: '', // Used when 'Other' issue is selected
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  })

  const university = UNIVERSITIES.find((u) => u.id === profile?.university_id)

  const getFloors = (block: string) => {
    if (['Ecole', 'IT-2'].includes(block)) return ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor']
    if (['School of Management', 'School of Law', 'School of Education', 'School of Media', 'IT-1'].includes(block)) {
      return ['Ground Floor', '1st Floor', '2nd Floor']
    }
    return []
  }

  const getRooms = (block: string, floor: string) => {
    if (block === 'Ecole') {
      if (floor === 'Ground Floor') return ['ECR-1', 'ECR-2', 'ECR-3', 'ECR-4', 'ECR-5']
      if (floor === '1st Floor') return ['ECR-6', 'ECR-7', 'ECR-8', 'ECR-9', 'ECR-10']
      if (floor === '2nd Floor') return ['ECR-11', 'ECR-12', 'ECR-13', 'ECR-14', 'ECR-15']
      if (floor === '3rd Floor') return ['ECR-16', 'ECR-17', 'ECR-18', 'ECR-19', 'ECR-20']
    } else if (['School of Management', 'School of Law', 'School of Education', 'School of Media'].includes(block)) {
      if (floor === 'Ground Floor') return ['Auditorium']
      if (floor === '1st Floor') return ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105']
      if (floor === '2nd Floor') return ['Room 201', 'Room 202', 'Room 203', 'Room 204', 'Room 205']
    }
    return [] // IT-1, IT-2 will use custom manual typing
  }

  const availableFloors = getFloors(form.block)
  const availableRooms = getRooms(form.block, form.room)
  const requiresManualRoom = ['IT-1', 'IT-2'].includes(form.block) || form.section === 'Other'

  // Reset dependent dropdowns when parent changes
  useEffect(() => {
    setForm((prev) => ({ ...prev, room: '', section: '', custom_section: '' }))
  }, [form.block])

  useEffect(() => {
    setForm((prev) => ({ ...prev, section: '', custom_section: '' }))
  }, [form.room])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return toast.error('Not logged in')

    const final_issue_type = form.issue_type === 'Other' ? form.custom_issue_type : form.issue_type
    const final_section = requiresManualRoom ? form.custom_section : form.section

    if (!final_issue_type.trim()) return toast.error('Please specify the issue type')
    if (!final_section.trim()) return toast.error('Please specify the room / area')

    setLoading(true)

    try {
      let image_url: string | null = null

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `issues/${profile.id}/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('issue-images').upload(path, imageFile)
        if (!upErr) {
          const { data } = supabase.storage.from('issue-images').getPublicUrl(path)
          image_url = data.publicUrl
        }
      }

      const ticket_id = generateTicketId(university?.name ?? 'SC')

      const { data, error } = await supabase
        .from('issues')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({
          block: form.block,
          room: form.room, // Storing Floor in DB 'room' column
          section: final_section, // Storing Room in DB 'section' column
          issue_type: final_issue_type,
          description: form.description,
          priority: form.priority,
          university_id: profile.university_id,
          reported_by: profile.id,
          image_url,
          ticket_id,
          status: 'pending',
        } as never)
        .select()
        .single()

      if (error) throw error
      const result = data as unknown as { ticket_id: string; id: string }
      toast.success('Issue submitted!')
      router.push(`/report/success?ticket=${result.ticket_id}&id=${result.id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit issue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!geoAllowed && university && (
        <GeoFenceGuard universityId={university.id} onAllowed={() => setGeoAllowed(true)} />
      )}

      <div className="flex flex-col min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <div className="grad-blue px-5 pt-12 pb-6 rounded-b-3xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white/60 text-xs">9:41</span>
            <Wifi size={11} className="text-white/60" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Report Issue</h1>
              <p className="text-white/60 text-xs">Fill in the details below</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 mt-5 space-y-4">
          {/* Block */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Block</label>
            <select
              value={form.block}
              onChange={(e) => setForm({ ...form, block: e.target.value })}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:border-blue-400 transition"
            >
              <option value="">Select Block</option>
              {BLOCKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Floor */}
          {form.block && (
            <div className="animate-slideUp">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Floor</label>
              <select
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:border-blue-400 transition"
              >
                <option value="">Select Floor</option>
                {availableFloors.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          )}

          {/* Room / Area */}
          {form.room && (
            <div className="animate-slideUp">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Room / Area</label>
              {availableRooms.length > 0 && !['IT-1', 'IT-2'].includes(form.block) ? (
                <select
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:border-blue-400 transition"
                >
                  <option value="">Select Room</option>
                  {availableRooms.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                  <option value="Other">Other (Type manually)</option>
                </select>
              ) : null}

              {requiresManualRoom && (
                <input
                  type="text"
                  placeholder="e.g. Lab 3, Server Room, etc."
                  value={form.custom_section}
                  onChange={(e) => setForm({ ...form, custom_section: e.target.value })}
                  required
                  className={`w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:border-blue-400 transition ${availableRooms.length > 0 ? 'mt-2' : ''}`}
                />
              )}
            </div>
          )}

          {/* Issue Type */}
          {form.room && (
            <div className="animate-slideUp border-t border-gray-100 pt-4 mt-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Issue Type</label>
              <select
                value={form.issue_type}
                onChange={(e) => setForm({ ...form, issue_type: e.target.value })}
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:border-blue-400 transition"
              >
                <option value="">Select Issue</option>
                {ISSUE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {form.issue_type === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify the issue type…"
                  value={form.custom_issue_type}
                  onChange={(e) => setForm({ ...form, custom_issue_type: e.target.value })}
                  required
                  className="w-full mt-2 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:border-blue-400 transition"
                />
              )}
            </div>
          )}

          {/* Description */}
          {form.issue_type && (
            <div className="animate-slideUp">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the issue in detail…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:border-blue-400 transition resize-none"
              />
            </div>
          )}

          {/* Image Upload */}
          {form.issue_type && (
            <div className="animate-slideUp">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Upload Image (Optional)
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-2xl" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">✕</span>
                  </button>
                </div>
              ) : (
                <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-white hover:border-blue-400 transition">
                  <div className="flex gap-2">
                    <Camera size={20} className="text-gray-400" />
                    <Upload size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400 font-medium">Tap to upload</p>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          )}

          {/* Priority */}
          {form.issue_type && (
            <div className="animate-slideUp">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Priority</label>
              <div className="flex gap-3">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <label
                    key={p}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      form.priority === p
                        ? p === 'high'
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : p === 'medium'
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={form.priority === p}
                      onChange={() => setForm({ ...form, priority: p })}
                      className="hidden"
                    />
                    {p === 'high' && <AlertTriangle size={14} />}
                    <span className="text-xs font-bold capitalize">{p}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          {form.issue_type && (
            <button
              type="submit"
              disabled={loading || !geoAllowed}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-70 shadow-lg shadow-blue-200 mt-2 animate-slideUp"
            >
              {loading ? 'Submitting…' : 'SUBMIT ISSUE'}
            </button>
          )}
        </form>
      </div>
    </>
  )
}
