import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { UNIVERSITIES } from '@/lib/universities'

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 })
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

  const DEMO_ACCOUNTS = [
    { role: 'student', full_name: 'Riya Sharma', email: 'student@smartcampus.in', password: 'student123' },
    { role: 'technician', full_name: 'Rajesh Mehta', email: 'tech@smartcampus.in', password: 'tech123' },
    { role: 'admin', full_name: 'Admin User', email: 'admin@smartcampus.in', password: 'admin123' },
  ]

  const univId = UNIVERSITIES[0].id // Use University of Mumbai by default for demo users

  try {
    for (const acc of DEMO_ACCOUNTS) {
      // Create user directly, bypassing email confirmation
      const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
      })

      // If user exists, we get an error, which we can ignore, but we need their ID.
      let userId = createData?.user?.id

      if (createErr && createErr.message.includes('already exists')) {
        // Find existing user to get ID
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
        userId = usersData?.users.find((u) => u.email === acc.email)?.id
      } else if (createErr) {
        console.error('Error creating user:', createErr)
        continue
      }

      if (!userId) continue

      // Upsert profile for the user
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        email: acc.email,
        full_name: acc.full_name,
        university_id: univId,
        role: acc.role
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Setup demo error:', error)
    return NextResponse.json({ error: 'Failed to setup demo users' }, { status: 500 })
  }
}
