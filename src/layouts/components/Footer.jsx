// components/Footer.jsx
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTools,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export default function Footer() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickLinks = [
    { label: "Trang chủ", path: "/" },
    { label: "Địa điểm", path: "/place" },
    { label: "Bản đồ", path: "/map" },
    { label: "Hồ sơ", path: "/profile" },
  ];

  const categories = [
    { label: "Nhà hàng", path: "/place?cat=restaurant" },
    { label: "Công viên", path: "/place?cat=park" },
    { label: "Điểm tham quan", path: "/place?cat=attraction" },
    { label: "Quán bar", path: "/place?cat=bar" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo + Intro */}
          <div className="space-y-4">
            <h1
              className="text-3xl font-bold text-white cursor-pointer tracking-wide"
              onClick={() => navigate("/")}
            >
              Bero<span className="text-blue-500">Travel</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Khám phá những địa điểm tuyệt vời xung quanh bạn. Tìm nhà hàng,
              quán cafe, điểm tham quan nhanh chóng và tiện lợi.
            </p>
            <div className="flex gap-3 mt-3">
              {[
                { icon: <FaFacebookF />, color: "hover:bg-blue-600" },
                { icon: <FaInstagram />, color: "hover:bg-pink-600" },
                { icon: <FaTwitter />, color: "hover:bg-sky-500" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-300 transition transform hover:scale-110 ${item.color}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-lg">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className="cursor-pointer font-medium transition-all duration-300 hover:text-blue-400"
                >
                  {link.label}
                </li>
              ))}
              {user?.role === "admin" && (
                <li
                  onClick={() => navigate("/admin")}
                  className="cursor-pointer flex items-center gap-2 font-medium transition-all duration-300 hover:text-purple-400"
                >
                  <FaTools className="text-purple-400" /> Trang quản trị
                </li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-lg">Danh mục</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.label}
                  onClick={() => navigate(cat.path)}
                  className="cursor-pointer text-gray-400 hover:text-blue-400 transition"
                >
                  {cat.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-lg">Liên hệ</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>Hà Nội, Việt Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-blue-400" />
                <span>+84 329 556 941</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                <span>maibui7879@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">BeroTravel</span>. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
