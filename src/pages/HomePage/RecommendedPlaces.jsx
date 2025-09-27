// components/RecommendedPlaces.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PlaceCard from "./PlaceCard";

export default function RecommendedPlaces({ places, userLocation }) {
  const navigate = useNavigate();

  if (!places || places.length === 0) return null;

  return (
    <section className="relative w-full px-4 md:px-12 py-12 rounded-3xl shadow-xl bg-gradient-to-r from-blue-50 to-blue-500">
      <div className="flex flex-col md:flex-row gap-8 relative md:items-center">
        {/* Column 1: Title + Button */}
        <div className="md:w-1/3 flex flex-col justify-center items-center md:items-start gap-3 h-full">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 text-center md:text-left">
            Khám phá những địa điểm gần bạn
          </h2>
          <p className="text-gray-600 text-sm md:text-base text-center md:text-left">
            Khám phá những địa điểm thú vị xung quanh bạn ngay hôm nay.
          </p>
          <button
            onClick={() => navigate("/place")}
            className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg transition-all duration-300 w-2/3 md:w-auto"
          >
            Tìm hiểu thêm
          </button>
        </div>

        {/* Column 2: Cards 3x2 */}
        <div className="md:w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {places.slice(0, 6).map((place) => (
            <PlaceCard
              key={place._id}
              place={place}
              userLocation={userLocation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
