'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { BookOpen, Users } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('username')
    if (role !== 'admin') {
      router.push('/login')
    } else {
      setUsername(name || '')
      fetchStats()
    }
  }, [])

  const fetchStats = async () => {
    const { count: bookCount } = await supabase
      .from('buku')
      .select('*', { count: 'exact', head: true })

    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    setTotalBooks(bookCount || 0)
    setTotalUsers(userCount || 0)
    setLoading(false)
  }

  if (loading) return <p className="p-6 text-center">Memuat dashboard admin...</p>

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">Halo, {username} 👋</h1>
        <p className="text-gray-600 text-lg">Selamat datang di dashboard admin perpustakaan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-blue-100 p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Buku</p>
            <h2 className="text-2xl font-semibold text-gray-800">{totalBooks}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-green-100 p-3 rounded-full">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Pengguna</p>
            <h2 className="text-2xl font-semibold text-gray-800">{totalUsers}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
