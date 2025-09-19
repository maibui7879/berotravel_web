// components/Footer.jsx
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo + Intro */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate("/")}>
              Bero<span className="text-blue-500">Travel</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Khám phá những địa điểm tuyệt vời xung quanh bạn. Chúng tôi giúp bạn tìm nhà hàng, quán cafe, điểm tham quan một cách nhanh chóng và tiện lợi.
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
              <li className="hover:text-white cursor-pointer" onClick={() => navigate("/")}>Trang chủ</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate("/place")}>Địa điểm</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate("/reviews")}>Review</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate("/about")}>Về chúng tôi</li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold">Danh mục</h3>
            <ul className="space-y-1">
              <li className="hover:text-white cursor-pointer" onClick={() => navigate("/place?cat=restaurant")}>Nhà hàng</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate("/place?cat=park")}>Công viên</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate("/place?cat=attraction")}>Điểm tham quan</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigate("/place?cat=bar")}>Quán bar</li>
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
