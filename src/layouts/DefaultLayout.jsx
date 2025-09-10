import { useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { HeaderProvider, useHeader } from "../contexts/headerContext";

function LayoutInner({ children }) {
  const { setTransparent } = useHeader();
  const mainRef = useRef(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const handleScroll = () => {
      console.log("[DefaultLayout][DEBUG] main.scrollTop:", el.scrollTop);
      setTransparent(el.scrollTop < 50);
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [setTransparent]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-200 overflow-x-hidden">
      <Header />
      <main ref={mainRef} className="flex-1 overflow-y-auto">
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
