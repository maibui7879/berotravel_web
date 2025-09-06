// src/layouts/DefaultLayout.js
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function DefaultLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-gray-200">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
