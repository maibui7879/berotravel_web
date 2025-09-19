// components/MapPreview.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../mapPage/components/MapView";

export default function MapPreview({ userLocation }) {
  const navigate = useNavigate();

  return (
    <section className="w-full pl-4 md:pl-12 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        {/* Column 1: Title + Button */}
        <div className="md:w-1/3 flex flex-col justify-center gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Khám phá bản đồ xung quanh bạn
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Xem vị trí các địa điểm nổi bật gần bạn trên bản đồ.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-blue-500 text-white py-2 px-5 rounded-xl hover:bg-white hover:text-blue-500 border border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Khám phá Map
          </button>
        </div>

        {/* Column 2: Map */}
        <div className="md:w-[50%] h-96 rounded-xl overflow-hidden shadow-lg">
          <MapView
            userLocation={userLocation}
            results={[]}
            route={null}
            radius={4}
            flyToPosition={null}
          />
        </div>
      </div>
    </section>
  );
}
