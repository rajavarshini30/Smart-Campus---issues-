'use client'

import { Home, ClipboardList, Bell, User, LayoutDashboard, Wrench } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const studentNav = [
  { href: '/dashboard',     icon: Home,          label: 'Home'      },
  { href: '/complaints',    icon: ClipboardList, label: 'Complaints' },
  { href: '/notifications', icon: Bell,          label: 'Alerts'    },
  { href: '/profile',       icon: User,          label: 'Profile'   },
]

const techNav = [
  { href: '/technician', icon: Wrench, label: 'My Tasks' },
  { href: '/profile',    icon: User,   label: 'Profile'  },
]

const adminNav = [
  { href: '/admin',   icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/profile', icon: User,            label: 'Profile'   },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { profile } = useAuth()

  const navItems =
    profile?.role === 'admin'
      ? adminNav
      : profile?.role === 'technician'
      ? techNav
      : studentNav

  return (
    <nav className="sticky bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50 safe-bottom shadow-[0_-1px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 flex-1 py-1 group"
            >
              <div
                className={`flex items-center justify-center w-12 h-8 rounded-2xl transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 shadow-md shadow-blue-200'
                    : 'group-hover:bg-gray-100'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                />
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

