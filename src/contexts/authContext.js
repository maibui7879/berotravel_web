import { createContext, useContext, useEffect, useState } from "react";
import { registerUser } from "../userServices/registerService";
import { loginUser } from "../userServices/loginService";
import { getProfile } from "../userServices/profileService";
import { logoutUser } from "../userServices/logoutService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (data) => {
    const res = await registerUser(data);
    return res;
  };

  const login = async (data) => {
    const res = await loginUser(data);
    await loadProfile();
    return res;
  };

  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
