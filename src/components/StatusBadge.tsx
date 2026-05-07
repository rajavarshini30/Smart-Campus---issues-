type Status = 'pending' | 'in_progress' | 'completed' | 'funding'

export default function StatusBadge({ status, assignedTo }: { status: Status; assignedTo?: string | null }) {
  // Determine labels based on status and assignment
  let label = ''
  let bg = ''
  let text = ''
  let dot = ''

  if (status === 'pending') {
    label = assignedTo ? 'Assigned to Technician' : 'Pending Assignment'
    bg = 'bg-amber-50'
    text = 'text-amber-700'
    dot = 'bg-amber-400'
  } else if (status === 'in_progress') {
    label = 'Work Started'
    bg = 'bg-blue-50'
    text = 'text-blue-700'
    dot = 'bg-blue-500'
  } else if (status === 'completed') {
    label = 'Work Done'
    bg = 'bg-emerald-50'
    text = 'text-emerald-700'
    dot = 'bg-emerald-500'
  } else if (status === 'funding') {
    label = 'Funding Required'
    bg = 'bg-purple-50'
    text = 'text-purple-700'
    dot = 'bg-purple-500'
  } else {
    label = 'Unknown'
    bg = 'bg-gray-50'
    text = 'text-gray-700'
    dot = 'bg-gray-400'
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
