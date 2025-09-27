import React, { useState, useEffect } from "react";
import RecommendedSection from "./RecommendedSection";
import CategorySection from "./CategorySection";

const categories = [
  { value: "restaurant", label: "Nhà hàng" },
  { value: "park", label: "Công viên" },
  { value: "attraction", label: "Điểm tham quan" },
  { value: "bar", label: "Quán bar" },
];

export default function PlacePage() {
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const savedLocation = sessionStorage.getItem("userLocation");
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
      setLoading(false);
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy < 200) {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          sessionStorage.setItem("userLocation", JSON.stringify(loc));
          setLoading(false);
        }
      },
      () => setLoading(false),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-12 relative">
      {/* Loading overlay */}
      {(loading || !userLocation) && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4 ">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Đang lấy vị trí...</p>
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      <RecommendedSection userLocation={userLocation} />
      <CategorySection userLocation={userLocation} categories={categories} />
    </div>
  );
}
