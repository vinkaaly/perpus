'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 relative overflow-hidden">
        {/* Text Section */}
        <div className="md:w-1/2 z-10">
          <h1 className="text-5xl font-bold text-blue-400 mb-6">Perpustakaan Digital</h1>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            Jelajahi koleksi buku kami yang luas secara online. Temukan buku favoritmu kapan saja dan di mana saja!
          </p>
          <Link
            href="/katalog"
            className="inline-block bg-blue-400 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
          >
            Jelajahi Sekarang
          </Link>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 relative mt-10 md:mt-0">
          <img
            src="buku.jpg" // Ganti dengan file gambar kamu
            alt="Rak Buku"
            className="rounded-lg shadow-lg w-ful"
          />
        </div>
      </section>

      {/* Optional Info Strip */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p className="text-lg">Akses gratis untuk seluruh mahasiswa | Peminjaman online | Koleksi buku terus bertambah</p>
        </div>
      </section>
    </main>
  )
}
