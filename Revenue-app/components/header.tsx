'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-100 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Revenue"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-pink-400 bg-clip-text text-transparent">
            Revenue
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-400 to-pink-400 px-4 py-2 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>

        {showMenu && (
          <div className="absolute top-full right-0 left-0 md:hidden border-b border-pink-100 bg-white p-4 flex flex-col gap-2">
            <span className="text-sm text-gray-600 px-2">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-400 to-pink-400 px-4 py-2 text-white text-sm font-medium w-full justify-center hover:opacity-90 transition-opacity"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
