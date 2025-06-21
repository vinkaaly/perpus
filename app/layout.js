import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Sistem Perpustakaan',
  description: 'Dashboard Admin & Mahasiswa',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Navbar global di atas semua halaman */}
        <Navbar />

        {/* Isi halaman */}
        <main className="pt-4">{children}</main>
      </body>
    </html>
  )
}
