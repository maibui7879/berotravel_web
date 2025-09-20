// components/CategoryPlaces.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlaceCard from "./PlaceCard";
import { searchNearby } from "../../services/placeServices/searchPlace";

const categories = [
  { value: "restaurant", label: "Nhà hàng" },
  { value: "park", label: "Công viên" },
  { value: "attraction", label: "Điểm tham quan" },
  { value: "bar", label: "Quán bar" },
];

export default function CategoryPlaces({ userLocation }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("restaurant");
  const [placesByCategory, setPlacesByCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = (category) => {
    setActiveCategory(category);
  };

  useEffect(() => {
    const fetchPlacesByCategory = async () => {
      if (!activeCategory || !userLocation) return;
      setLoading(true);

      try {
        const res = await searchNearby(
          userLocation.lat,
          userLocation.lng,
          10,
          "",
          activeCategory,
          1,
          6
        );
        setPlacesByCategory(res.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy địa điểm theo category:", err);
        setPlacesByCategory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlacesByCategory();
  }, [activeCategory, userLocation]);

  if (!userLocation) return null;

  return (
    <section className="relative w-full pl-4 md:pl-12 py-12 rounded-2xl shadow-lg">
      <div className="absolute inset-0 rounded-2xl"></div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 relative">
        {/* Column 1: Place Cards */}
        <div className="md:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-6 order-2 md:order-1 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {placesByCategory.slice(0, 6).map((place) => (
            <PlaceCard key={place._id} place={place} userLocation={userLocation} />
          ))}
        </div>

        {/* Column 2: Title + Categories + Button */}
        <div className="md:w-1/3 flex flex-col justify-start gap-4 order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl mr-12 font-extrabold text-gray-800 text-right">
            Khám phá theo loại địa điểm
          </h2>
          <p className="text-gray-600 text-sm mr-12 md:text-base text-right">
            Chọn loại địa điểm bạn muốn khám phá gần mình.
          </p>

          {/* Categories responsive */}
          <div className="grid grid-cols-2 gap-3 mt-2 md:flex md:flex-col md:items-end">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <div
                  key={cat.value}
                  onClick={() => handleClick(cat.value)}
                  className={`cursor-pointer py-2 px-4 rounded-xl text-center font-semibold transition-all duration-300 transform
                    ${isActive
                      ? "bg-blue-500 text-white scale-105 shadow-lg w-full md:w-80"
                      : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100 hover:text-blue-700 hover:scale-105 w-full md:w-64"
                    }`}
                >
                  {cat.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
