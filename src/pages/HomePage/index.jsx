// HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../mapPage/components/MapView";
import StatsCards from "./StatsCards";
import RecommendedPlaces from "./RecommendedPlaces";
import MapPreview from "./MapPreview";
import CategoryPlaces from "./CategoryPlaces";
import { getPlacesCount, getUsersCount, getReviewsCount } from "../../services/userServices/StatServices";
import { searchNearby } from "../../services/placeServices/searchPlace";
import { FaSearch } from "react-icons/fa";
import API from "../../services/api";
import ReviewSection from "./ReviewSection";
import bgReview from "../../assets/laika-cafe-1.webp";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [stats, setStats] = useState({ places: 0, users: 0, reviews: 0 });
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Trình duyệt không hỗ trợ định vị");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [places, users, reviews] = await Promise.all([
          getPlacesCount(),
          getUsersCount(),
          getReviewsCount(),
        ]);
        setStats({ places, users, reviews });
      } catch (err) {
        console.error("Lỗi khi lấy thống kê:", err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!userLocation) return;
      try {
        const res = await searchNearby(userLocation.lat, userLocation.lng, 1, "", "", 1, 10);
        setRecommendedPlaces(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy địa điểm gợi ý:", err);
      }
    };
    fetchRecommended();
  }, [userLocation]);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        const res = await API.get("/reviews/top");
        setTopReviews(res.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy review nổi bật:", err);
      }
    };
    fetchTopReviews();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/?q=${encodeURIComponent(searchQuery)}&cat=&r=100&page=1`);
  };

  if (loading || !userLocation) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100 py-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium">Đang lấy vị trí...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Map */}
      <section className="relative h-screen w-full">
        <MapView
          userLocation={userLocation}
          results={[]}
          route={null}
          radius={4}
          flyToPosition={null}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center p-4 z-[400]">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
            Khám phá địa điểm cùng Bero<span className="text-blue-900">Travel</span>
          </h1>
          <p className="text-white text-md md:text-lg mb-4">
            Tìm quán cafe, nhà hàng và trải nghiệm mới gần bạn
          </p>
          <div className="flex items-center w-3/4 md:w-1/4 bg-white rounded-full shadow px-4 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-1 transition">
            <input
              type="text"
              placeholder="Tìm địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              className="ml-3 text-blue-500 hover:text-blue-600 p-2 rounded-full transition flex items-center justify-center"
            >
              <span className="text-lg"><FaSearch /></span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Recommended Places */}
      <RecommendedPlaces places={recommendedPlaces} userLocation={userLocation} />

      {/* Category Places */}
      <CategoryPlaces userLocation={userLocation} />

      {/* Map Preview */}
      <MapPreview userLocation={userLocation} />
      {/* Top Reviews */}
      {topReviews.length > 0 && (
        <section
          className="px-4 md:px-12 py-12 relative"
          style={{
            backgroundImage: `url(${bgReview})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Lớp phủ */}
          <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-20">Review nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topReviews.map((review) => (
                <ReviewSection key={review._id} review={review} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
