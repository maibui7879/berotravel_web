import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export function HeaderProvider({ children }) {
  const [transparent, setTransparent] = useState(false);
  return (
    <HeaderContext.Provider value={{ transparent, setTransparent }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  return useContext(HeaderContext);
}
