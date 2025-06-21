'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabaseClient'

export default function TambahBuku() {
  const [books, setBooks] = useState([])
  const [judul, setJudul] = useState('')
  const [penulis, setPenulis] = useState('')
  const [tahun, setTahun] = useState('')
  const [kategori, setKategori] = useState('')
  const [rating, setRating] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [gambar, setGambar] = useState(null)
  const [editId, setEditId] = useState(null)

  const fetchBooks = async () => {
    const { data, error } = await supabase.from('buku').select('*')
    if (error) alert('Gagal mengambil data buku')
    else setBooks(data)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const resetForm = () => {
    setJudul('')
    setPenulis('')
    setTahun('')
    setKategori('')
    setRating('')
    setDeskripsi('')
    setGambar(null)
    setEditId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageUrl = ''

    if (gambar) {
      const ext = gambar.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const filePath = `cover/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('buku-cover')
        .upload(filePath, gambar)

      if (uploadError) {
        alert('Gagal upload gambar: ' + uploadError.message)
        return
      }

      const { data: urlData } = supabase.storage
        .from('buku-cover')
        .getPublicUrl(filePath)

      imageUrl = urlData.publicUrl
    }

    const payload = {
      title: judul,
      author: penulis,
      year: parseInt(tahun),
      category: kategori,
      rating: parseFloat(rating),
      description: deskripsi,
      ...(imageUrl && { cover: imageUrl })
    }

    let error

    if (editId) {
      const res = await supabase.from('buku').update(payload).eq('id', editId)
      error = res.error
    } else {
      const res = await supabase.from('buku').insert([payload])
      error = res.error
    }

    if (error) {
      alert('Gagal menyimpan buku: ' + error.message)
    } else {
      alert('Buku berhasil disimpan!')
      resetForm()
      fetchBooks()
    }
  }

  const handleEdit = (book) => {
    setEditId(book.id)
    setJudul(book.title)
    setPenulis(book.author)
    setTahun(book.year)
    setKategori(book.category)
    setRating(book.rating)
    setDeskripsi(book.description)
  }

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus buku ini?')) {
      const { error } = await supabase.from('buku').delete().eq('id', id)
      if (error) {
        alert('Gagal menghapus: ' + error.message)
      } else {
        alert('Buku berhasil dihapus')
        fetchBooks()
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          {editId ? 'Edit Buku' : 'Tambah Buku'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" placeholder="Judul" value={judul} onChange={(e) => setJudul(e.target.value)} className="p-2 border rounded" />
          <input type="text" placeholder="Penulis" value={penulis} onChange={(e) => setPenulis(e.target.value)} className="p-2 border rounded" />
          <input type="number" placeholder="Tahun" value={tahun} onChange={(e) => setTahun(e.target.value)} className="p-2 border rounded" />
          <input type="text" placeholder="Kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} className="p-2 border rounded" />
          <input type="number" step="0.1" placeholder="Rating" value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border rounded" />
          <input type="file" accept="image/*" onChange={(e) => setGambar(e.target.files[0])} className="p-2 border rounded" />
        </div>
        <textarea placeholder="Deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="w-full mt-4 p-2 border rounded h-24" />
        <div className="mt-4 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? 'Perbarui' : 'Tambah'}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Daftar Buku */}
      <h2 className="text-xl font-semibold mb-4">Daftar Buku</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <img
  src={book.cover}
  alt={book.title}
  className="w-full h-64 object-contain mb-3 rounded-md bg-white p-2"
/>

            <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-1">Penulis: {book.author}</p>
            <p className="text-sm text-gray-600">Tahun: {book.year}</p>
            <p className="text-sm text-gray-600">Kategori: {book.category}</p>
            <p className="text-sm text-gray-600 mb-2">Rating: {book.rating}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(book)} className="bg-yellow-500 text-white text-sm px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(book.id)} className="bg-red-600 text-white text-sm px-3 py-1 rounded">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
