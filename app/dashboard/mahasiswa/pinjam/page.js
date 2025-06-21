"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HalamanPeminjaman() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeminjaman = async () => {
      const username = localStorage.getItem("username");
      if (!username) return alert("Harap login terlebih dahulu.");

      // Ambil UUID user berdasarkan username
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

      if (userError || !userData) {
        console.error("User tidak ditemukan:", userError);
        setLoading(false);
        return;
      }

      // Ambil daftar peminjaman berdasarkan UUID user
      const { data, error } = await supabase
        .from("peminjaman")
        .select(`id, tanggal_pinjam, status, buku: buku_id (id, title, author, cover)`)
        .eq("user_id", userData.id)
        .order("tanggal_pinjam", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data peminjaman:", error);
      } else {
        setPeminjaman(data);
      }

      setLoading(false);
    };

    fetchPeminjaman();
  }, []);

  const handleBatalkan = async (id) => {
    const confirm = window.confirm("Yakin ingin membatalkan peminjaman?");
    if (!confirm) return;

    const { error } = await supabase.from("peminjaman").delete().eq("id", id);
    if (error) {
      alert("Gagal membatalkan: " + error.message);
    } else {
      alert("Peminjaman dibatalkan.");
      setPeminjaman((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 Daftar Peminjaman Buku</h1>

      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : peminjaman.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada peminjaman.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {peminjaman.map((item) => (
            <div key={item.id} className="bg-white shadow rounded p-4 flex gap-4">
              <img
                src={item.buku?.cover || "/no-image.jpg"}
                alt={item.buku?.title}
                className="w-24 h-36 object-cover rounded"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{item.buku?.title}</h2>
                  <p className="text-sm text-gray-600">Penulis: {item.buku?.author}</p>
                  <p className="text-sm text-gray-500">
                    Tanggal: {new Date(item.tanggal_pinjam).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">Status: {item.status}</p>
                </div>
                <button
                  onClick={() => handleBatalkan(item.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  Batalkan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
