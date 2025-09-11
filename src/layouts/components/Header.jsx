// src/layouts/components/Header.jsx
import { useState, useRef, useEffect } from "react";
import { FaHome, FaListAlt, FaMapMarkerAlt, FaUser, FaSignOutAlt, FaHeart, FaIdBadge } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useHeader } from "../../contexts/headerContext";
import { useAuth } from "../../contexts/authContext";

export default function Header() {
  const { transparent } = useHeader();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/auth");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-20 p-4 px-8 flex justify-between items-center shadow-lg transition-colors duration-300
        ${transparent ? "bg-transparent text-white" : "bg-white text-black"}`}
    >
      <h1 className="text-xl font-bold">BeroTravel</h1>
      <nav className="flex space-x-6 items-center relative">
        <Link
          to="/home"
          className={`flex items-center gap-2 transition-colors duration-300 ${
            transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
          }`}
        >
          <FaHome /> Home
        </Link>
        <Link
          to="/place"
          className={`flex items-center gap-2 transition-colors duration-300 ${
            transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
          }`}
        >
          <FaListAlt /> Khám phá
        </Link>
        <Link
          to="/"
          className={`flex items-center gap-2 transition-colors duration-300 ${
            transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
          }`}
        >
          <FaMapMarkerAlt /> Bản đồ
        </Link>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className={`flex items-center gap-2 transition-colors duration-300 ${
              transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
            }`}
          >
            <FaUser /> {user ? user.name : "Profile"}
          </button>

          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg flex flex-col z-50 transition-all duration-200
                ${transparent ? "bg-white/20 backdrop-blur-md border border-white/30" : "bg-white border border-gray-300"}`}
            >
              <Link
                to="/profile"
                className={`flex items-center gap-2 mx-4 px-2 py-3 transition-colors duration-200 rounded-t-lg border-b-2 
                  ${transparent ? "text-white border-white/30 hover:text-gray-300" : "text-gray-800 border-gray-200 hover:text-gray-500"}`}
                onClick={() => setDropdownOpen(false)}
              >
                <FaIdBadge /> Hồ sơ
              </Link>
              <Link
                to="/favorites"
                className={`flex items-center gap-2 mx-4 px-2 py-3 transition-colors duration-200 border-b-2
                  ${transparent ? "text-white border-white/30  hover:text-gray-300" : "text-gray-800 border-gray-200 hover:text-gray-500"}`}
                onClick={() => setDropdownOpen(false)}
              >
                <FaHeart /> List yêu thích
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 mx-4 px-2 py-3 transition-colors duration-200 border-b-2
                  ${transparent ? "text-white border-white/30  hover:text-red-600" : "border-gray-300 text-red-500 hover:text-red-600"}`}
              >
                <FaSignOutAlt /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
