// src/components/Sidebar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaListAlt, FaMapMarkerAlt, FaUser, FaBars } from "react-icons/fa";

const menuItems = [
  { to: "/home", icon: <FaHome />, label: "Home", active: false },
  { to: "/place", icon: <FaListAlt />, label: "Place", active: false },
  { to: "/", icon: <FaMapMarkerAlt />, label: "Map", active: true },
  { to: "/profile", icon: <FaUser />, label: "Profile", active: false },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`bg-gray-200 h-full flex flex-col transition-all duration-300 ${
        expanded ? "w-80" : "w-20"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="p-4 py-8 w-full bg-gray-200 flex justify-center items-center border-b text-gray-700 outline-none focus:outline-none focus:ring-0 hover:border-none"
      >
        <FaBars />
      </button>

      {/* Menu */}
      <nav
        className={`flex-1 flex flex-col justify-between py-6 max-h-64 space-y-4 ${
          expanded ? "items-start px-4" : "items-center"
        }`}
      >
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`relative flex items-center group outline-none focus:outline-none focus:ring-0 hover:border-none ${
              item.active ? "text-gray-700" : "text-gray-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {expanded && (
              <span className="ml-3 text-sm">{item.label}</span>
            )}

            {/* Tooltip khi thu gọn */}
            {!expanded && (
              <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded bg-gray-900 text-white opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
