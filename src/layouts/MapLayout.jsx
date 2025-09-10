// src/layouts/MapLayout.js

export default function MapLayout({ children }) {
  return (
    <div className="flex min-h-screen relative">
      <main className="flex-1">{children}</main>
    </div>
  );
}
