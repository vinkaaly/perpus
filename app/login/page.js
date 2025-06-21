"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") router.push("/dashboard/admin");
    if (role === "mahasiswa") router.push("/dashboard/mahasiswa");
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (username === "admin" && password === "123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("username", "admin");
      setSuccess("Login sebagai Admin berhasil...");
      setTimeout(() => {
        router.push("/dashboard/admin");
      }, 1500);
      return false;
    }

    const { data, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (fetchError || !data) {
      setError("Username atau password salah.");
      setLoading(false);
      return;
    }

    if (!data.role) {
      setError("Akun tidak memiliki role, hubungi admin.");
      setLoading(false);
      return;
    }

    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);
    localStorage.setItem("user_id", data.id);

    setSuccess(`Login sebagai ${data.role} berhasil...`);
    setTimeout(() => {
      router.push(`/dashboard/${data.role}`);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"
        >
          <h2 className="text-3xl font-bold mb-3 text-center text-blue-600">
            Login
          </h2>

          {/* 🔔 Tambahkan keterangan akun admin di sini */}
          <p className="text-sm text-gray-500 text-center mb-4">
            Untuk login sebagai admin, gunakan <strong>Username: admin</strong> dan <strong>Password: 123</strong>
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-600 px-4 py-2 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-3 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Mengecek..." : "Login"}
          </button>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-blue-500 hover:underline">
              ⬅️ Kembali ke Beranda
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
