'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { BookOpen, History } from 'lucide-react'

export default function MahasiswaDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [jumlahPinjam, setJumlahPinjam] = useState(0)
  const [jumlahBuku, setJumlahBuku] = useState(0)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('username')
    const user_id = localStorage.getItem('user_id')

    if (role !== 'mahasiswa') {
      router.push('/login')
    } else {
      setUsername(name || '')
      fetchStats(user_id)
    }
  }, [])

  const fetchStats = async (userId) => {
    // Hitung jumlah buku
    const { count: bukuCount } = await supabase
      .from('buku')
      .select('*', { count: 'exact', head: true })

    // Hitung total peminjaman untuk user ini
    const { count: pinjamCount } = await supabase
      .from('peminjaman')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    setJumlahBuku(bukuCount || 0)
    setJumlahPinjam(pinjamCount || 0)
    setLoading(false)
  }

  if (loading) return <p className="p-6 text-center">Memuat dashboard mahasiswa...</p>

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-white via-green-50 to-green-100">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">Halo, {username} 👋</h1>
        <p className="text-gray-600 text-lg">Selamat datang di dashboard mahasiswa perpustakaan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-green-100 p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500">Jumlah Buku Tersedia</p>
            <h2 className="text-2xl font-semibold text-gray-800">{jumlahBuku}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-yellow-100 p-3 rounded-full">
            <History className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Peminjaman Anda</p>
            <h2 className="text-2xl font-semibold text-gray-800">{jumlahPinjam}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
