'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nama, setNama] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('users').insert([
      {
        username,
        password,
        nama,
        role: 'mahasiswa',
      },
    ])

    setLoading(false)

    if (error) {
      alert('❌ Gagal registrasi: ' + error.message)
    } else {
      alert('✅ Registrasi berhasil! Silakan login.')
      router.push('/login')
    }
  }

  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-12">
        <form
          onSubmit={handleRegister}
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-blue-100"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Registrasi Akun</h2>

          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            Sudah punya akun?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login di sini
            </a>
          </p>
        </form>
      </div>
    </>
  )
}
