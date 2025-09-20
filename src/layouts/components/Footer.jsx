// components/Footer.jsx
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Trang chủ", path: "/" },
    { label: "Địa điểm", path: "/place" },
    { label: "Review", path: "/reviews" },
    { label: "Về chúng tôi", path: "/about" },
  ];

  const categories = [
    { label: "Nhà hàng", path: "/place?cat=restaurant" },
    { label: "Công viên", path: "/place?cat=park" },
    { label: "Điểm tham quan", path: "/place?cat=attraction" },
    { label: "Quán bar", path: "/place?cat=bar" },
  ];

  const gradientClass =
    "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500";

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo + Intro */}
          <div className="space-y-4">
            <h1
              className="text-2xl font-bold text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              Bero<span className="text-blue-500">Travel</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Khám phá những địa điểm tuyệt vời xung quanh bạn. Tìm nhà hàng, quán cafe, điểm tham quan nhanh chóng và tiện lợi.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:text-blue-500 transition"><FaFacebookF /></a>
              <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
              <a href="#" className="hover:text-blue-400 transition"><FaTwitter /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li
                  key={link.label}
                  onClick={() => navigate(link.path)}
                  className={`cursor-pointer font-semibold transition-all duration-300 ${gradientClass}`}
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold">Danh mục</h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li
                  key={cat.label}
                  onClick={() => navigate(cat.path)}
                  className={`cursor-pointer font-semibold transition-all duration-300 ${gradientClass}`}
                >
                  {cat.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold">Liên hệ</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaMapMarkerAlt /> <span>Hà Nội, Việt Nam</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaPhoneAlt /> <span>+84 123 456 789</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaEnvelope /> <span>support@berotravel.com</span>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BeroTravel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
