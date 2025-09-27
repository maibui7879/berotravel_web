import AdminHeader from "./components/AdminHeader";
import Footer from "./components/Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="flex-1 p-6 mt-16"> {/* mt-16 để tránh header cố định che nội dung */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
