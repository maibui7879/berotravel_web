// src/layouts/MapLayout.js
import Sidebar from "./components/Sidebar";

export default function MapLayout({ children }) {
  return (
    <div className="flex min-h-screen relative">
      <aside className="fixed top-0 left-0 h-full bg-gray-100 z-[401] shadow">
        <Sidebar />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
