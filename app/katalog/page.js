"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function KatalogBuku() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from("buku").select("*");
      if (error) console.error("Gagal ambil data:", error);
      else setBooks(data);
    };
    fetchBooks();
  }, []);

  const handlePinjam = async (book) => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Silakan login sebagai mahasiswa terlebih dahulu.");
    return;
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (userError || !userData) {
    console.error("User tidak ditemukan", userError);
    return;
  }

  // ✅ Cek apakah buku sudah pernah dipinjam dan belum dikembalikan
  const { data: existing, error: checkError } = await supabase
    .from("peminjaman")
    .select("*")
    .eq("user_id", userData.id)
    .eq("buku_id", book.id)
    .in("status", ["pending", "diproses"]);

  if (checkError) {
    alert("Gagal memeriksa status peminjaman.");
    return;
  }

  if (existing && existing.length > 0) {
    alert(`Buku "${book.title}" sudah ada di daftar peminjaman kamu.`);
    return;
  }

  // ✅ Jika belum pernah dipinjam atau sudah dikembalikan
  const { error: pinjamError } = await supabase.from("peminjaman").insert({
    user_id: userData.id,
    buku_id: book.id,
    status: "pending",
    tanggal_pinjam: new Date().toISOString(),
  });

  if (pinjamError) {
    alert("Gagal meminjam buku: " + pinjamError.message);
  } else {
    alert(`Buku "${book.title}" berhasil dimasukkan ke daftar peminjaman.`);
  }
};


  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">📚 Katalog Buku</h1>

      <div className="mb-6 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Telusuri berdasarkan judul atau penulis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="flex">
              <img
                src={book.cover}
                alt={book.title}
                className="w-32 h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    Penulis: {book.author}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Tahun: {book.year}
                  </p>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-3">
                    {book.description}
                  </p>
                </div>
                <button
                  onClick={() => handlePinjam(book)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  Pinjam
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            Buku tidak ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
