import { useState } from "react";
import { FaSearch, FaHome, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useAuth } from "../../../contexts/authContext";

export default function SearchBar({ onSearch }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [radius, setRadius] = useState(4);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch({ name, category, radius });
    setShowAdvanced(false);
  };

  const miniNavItems = [
    { icon: <FaHome />, label: "Home", to: "/" },
    { icon: <FaMapMarkerAlt />, label: "Bản đồ", to: "/map" },
    { icon: <FaSearch />, label: "Khám phá", to: "/place" },
    { icon: <FaUser />, label: "Profile", to: "/profile" },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col gap-3 w-full">
      <div className="flex justify-between w-full mb-2">
        {miniNavItems.map((item) => (
          <Tippy content={item.label} key={item.to}>
            <button
              onClick={() => {
                if (item.to === "/profile" && !user) navigate("/auth");
                else navigate(item.to);
              }}
              className="p-3 rounded-xl transition flex items-center justify-center w-full mx-1 text-blue-500 hover:text-blue-600"
            >
              {item.icon}
            </button>
          </Tippy>
        ))}
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Tên địa điểm..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="border rounded-xl p-3 w-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 text-blue-500 hover:text-blue-600 p-2 rounded-xl focus:outline-none"
        >
          <FaSearch />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-blue-500 hover:underline self-start"
      >
        {showAdvanced ? "Ẩn tùy chọn nâng cao" : "Hiển thị tùy chọn nâng cao"}
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-3 mt-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-xl p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Chọn loại --</option>
            <option value="restaurant">Nhà hàng</option>
            <option value="cafe">Quán cafe</option>
            <option value="school">Trường học</option>
            <option value="fast_food">Đồ ăn nhanh</option>
            <option value="supermarket">Siêu thị</option>
            <option value="university">Đại học</option>
            <option value="attraction">Điểm tham quan</option>
            <option value="bar">Quán bar</option>
            <option value="convenience">Cửa hàng tiện lợi</option>
            <option value="marketplace">Chợ</option>
            <option value="kindergarten">Mẫu giáo</option>
            <option value="language_school">Trung tâm ngoại ngữ</option>
            <option value="playground">Sân chơi</option>
            <option value="internet_cafe">Internet cafe</option>
            <option value="driving_school">Trường dạy lái xe</option>
            <option value="park">Công viên</option>
            <option value="music_school">Nhạc viện</option>
            <option value="prep_school">Trường dự bị</option>
            <option value="fountain">Đài phun nước</option>
            <option value="college">Cao đẳng</option>
          </select>

          <div className="flex items-center gap-2">
            <span>Tìm trong bán kính</span>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="border rounded-xl p-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span>km</span>
          </div>
        </div>
      )}
    </div>
  );
}
