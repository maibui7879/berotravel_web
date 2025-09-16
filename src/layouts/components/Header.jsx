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

  const navItems = [
    { to: "/home", icon: <FaHome />, label: "Home" },
    { to: "/place", icon: <FaListAlt />, label: "Khám phá" },
    { to: "/", icon: <FaMapMarkerAlt />, label: "Bản đồ" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-20 p-4 px-8 flex justify-between items-center shadow-lg transition-colors duration-300
        ${transparent ? "bg-transparent text-white" : "bg-white text-black"}`}
    >
      <h1 className="text-xl font-bold">BeroTravel</h1>

      <nav className="flex space-x-4 md:space-x-6 items-center relative">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-2 transition-colors duration-300
              ${transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"}`}
          >
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className={`flex items-center gap-2 transition-colors duration-300
              ${transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"}`}
          >
            <FaUser />
            <span className="hidden md:inline">{user ? user.name : "Profile"}</span>
          </button>

          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg flex flex-col z-50 bg-white text-gray-900 transition-all duration-200
               `}
            >
              <Link
                to="/profile"
                className={`flex items-center gap-2 mx-4 px-2 py-3 transition-colors duration-200 rounded-t-lg border-b
                  ${transparent ? "text-gray-900 border-gray-200 hover:text-gray-700" : " border-gray-500 hover:text-gray-200"}`}
                onClick={() => setDropdownOpen(false)}
              >
                <FaIdBadge /> <span>Hồ sơ</span>
              </Link>
              <Link
                to="/favorites"
                className={`flex items-center gap-2 mx-4 px-2 py-3 transition-colors duration-200 border-b
                  ${transparent ? "text-gray-900 border-gray-200 hover:text-gray-700" : " border-gray-500 hover:text-gray-200"}`}
                onClick={() => setDropdownOpen(false)}
              >
                <FaHeart /> <span>List yêu thích</span>
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 mx-4 px-2 py-3 transition-colors duration-200 text-red-500
                  ${transparent ? "  hover:text-red-600" : "text-red-500 hover:text-red-600"}`}
              >
                <FaSignOutAlt /> <span >Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
