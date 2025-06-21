// Navbar.js
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [role, setRole] = useState(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    setRole(storedRole)
  }, [pathname])

  const toggleMenu = () => setMenuOpen(!menuOpen)

  const logout = () => {
    localStorage.clear()
    router.push('/login')
  }

  if (["/login"].includes(pathname)) return null;

  const commonItems = role
    ? [{ label: 'Dashboard', href: `/dashboard/${role}` }, { label: 'Katalog', href: '/katalog' }]
    : [{ label: 'Beranda', href: '/' }, { label: 'Katalog', href: '/katalog' }]

  const adminItems = [
    { label: 'Edit Buku', href: '/dashboard/admin/buku' },
  ]

  const mahasiswaItems = [
    { label: 'Pinjam Buku', href: '/dashboard/mahasiswa/pinjam' },
  ]

  const roleItems = role === 'admin' ? adminItems : role === 'mahasiswa' ? mahasiswaItems : []

  const authItems = role
    ? [{ label: 'Logout', action: logout }]
    : [
        { label: 'Register', href: '/register' },
        { label: 'Login', href: '/login' },
      ]

  const navLinkStyle = (href) =>
    `block px-4 py-2 rounded-md transition ${
      pathname === href
        ? 'bg-blue-100 text-blue-700 font-semibold'
        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
    }`

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-500 flex items-center gap-1">
          📚 <span className="tracking-tight">Perpustakaan</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          {[...commonItems, ...roleItems].map((item) => (
            <Link key={item.href} href={item.href} className={navLinkStyle(item.href)}>
              {item.label}
            </Link>
          ))}
          {authItems.map((item, idx) =>
            item.href ? (
              <Link key={idx} href={item.href} className="text-gray-600 hover:text-blue-600 px-3 py-2">
                {item.label}
              </Link>
            ) : (
              <button
                key={idx}
                onClick={item.action}
                className="text-red-600 hover:underline px-3 py-2"
              >
                {item.label}
              </button>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-2 animate-fade-in-down">
          {[...commonItems, ...roleItems].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={navLinkStyle(item.href)}
            >
              {item.label}
            </Link>
          ))}
          {authItems.map((item, idx) =>
            item.href ? (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={idx}
                onClick={() => {
                  item.action()
                  setMenuOpen(false)
                }}
                className="block px-4 py-2 text-red-600"
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </nav>
  )
}
