// app/contact/page.js
export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <img
          src="/profile.jpg" // Ganti dengan nama file gambarmu di /public folder
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full shadow mb-4 object-cover"
        />

        <h1 className="text-2xl font-bold text-blue-600 mb-1">Vinka Aleyka Derina</h1>
        <p className="text-gray-600 mb-4">Universitas Ma'Soem · Sistem Informasi</p>

        <div className="text-left space-y-2 mt-6">
          <p className="text-gray-700"><span className="font-semibold">📧 Email:</span> valeyka@gmail.com</p>
          <p className="text-gray-700"><span className="font-semibold">📞 Telepon:</span> 0896-0418-7757</p>
        </div>

        <p className="mt-6 text-sm text-gray-500">© {new Date().getFullYear()} Perpustakaan Digital</p>
      </div>
    </div>
  );
}
