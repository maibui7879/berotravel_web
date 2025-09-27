import { useState, useRef, useEffect } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function AdminHeader() {
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

  const handleSwitchMode = () => {
    navigate("/");
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Panel</h1>

      <nav className="flex items-center gap-4 relative">
        {/* Tạm thời chỉ có mục Logs */}
        <span className="text-gray-800 font-medium hover:text-blue-600 cursor-pointer">
          Logs
        </span>

        {/* Dropdown user */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
          >
            <FaUser />
            <span>{user?.name || "Admin"}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg flex flex-col z-50 border border-gray-200">
              <button
                onClick={handleSwitchMode}
                className="px-4 py-3 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
              >
                <FaUser /> Chuyển về chế độ bình thường
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-3 hover:bg-gray-100 text-red-500 flex items-center gap-2 border-t border-gray-200"
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
