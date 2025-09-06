// src/layouts/AuthLayout.js
export default function AuthLayout({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <main className="w-full max-w-md p-6 bg-white rounded-2xl shadow">{children}</main>
    </div>
  );
}
