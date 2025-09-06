import { FaHome, FaListAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-20 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold">BeroTravel</h1>
      <nav className="flex space-x-6 ">
        <Link to="/home" className="flex items-center gap-2 hover:text-gray-300 text-white">
          <FaHome /> Home
        </Link>
        <Link to="/place" className="flex items-center gap-2 hover:text-gray-300 text-white">
          <FaListAlt /> Khám phá
        </Link>
        <Link to="/" className="flex items-center gap-2 hover:text-gray-300 text-white">
          <FaMapMarkerAlt /> Bản đồ
        </Link>
        <Link to="/profile" className="flex items-center gap-2 hover:text-gray-300 text-white">
          <FaUser /> Profile
        </Link>
      </nav>
    </header>
  );
}
