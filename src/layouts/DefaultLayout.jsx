import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { HeaderProvider, useHeader } from "../contexts/headerContext";

function LayoutInner({ children }) {
  const { setTransparent } = useHeader();

  useEffect(() => {
    const handleScroll = () => {
      setTransparent(window.scrollY < 50);
    };

    handleScroll(); // set giá trị ban đầu
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setTransparent]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-200 overflow-x-hidden">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function DefaultLayout({ children }) {
  return (
    <HeaderProvider>
      <LayoutInner>{children}</LayoutInner>
    </HeaderProvider>
  );
}
