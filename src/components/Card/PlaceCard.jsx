import { useEffect, useState } from "react";
import {
  FaRoute,
  FaInfoCircle,
  FaStar,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getRatingSummary } from "../../services/reviewServices/reviewServices";

export default function PlaceCard({
  place,
  userLocation,
  loadingDirections,
  clickable = true,
}) {
  const navigate = useNavigate();
  const [ratingSummary, setRatingSummary] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await getRatingSummary(place._id);
        setRatingSummary(res);
      } catch (err) {
        console.error("Lỗi lấy rating:", err);
      }
    };
    if (place?._id) fetchRating();
  }, [place?._id]);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance =
    userLocation && place?.latitude && place?.longitude
      ? getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lng,
          Number(place.latitude),
          Number(place.longitude)
        ).toFixed(1)
      : null;

  const avgRating = ratingSummary?.average || 0;
  const totalVotes = ratingSummary?.totalVotes || 0;

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 bg-white ${
        clickable ? "cursor-pointer" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-44 md:h-52 overflow-hidden">
        <img
          src={
            place?.image_url && place.image_url.trim() !== ""
              ? place.image_url
              : "/placeholder.png"
          }
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          alt={place?.name || "placeholder"}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Category badge */}
        {place?.category && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <FaTag className="text-[10px]" /> {place.category}
          </span>
        )}

        {/* Distance */}
        {distance && (
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <FaMapMarkerAlt className="text-red-400" /> {distance} km
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
            {place?.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(avgRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-700 font-medium">
              {totalVotes > 0
                ? `${avgRating.toFixed(1)} (${totalVotes})`
                : "Chưa có đánh giá"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <button
            disabled={loadingDirections}
            onClick={() =>
              navigate(`/map?directions=${place?._id}&q=${encodeURIComponent(place?.name)}`)
            }
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition ${
              loadingDirections
                ? "bg-green-400 text-white opacity-50 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-white hover:text-green-600 border border-green-500"
            }`}
          >
            {loadingDirections ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FaRoute /> Chỉ đường
              </>
            )}
          </button>

          <button
            onClick={() => navigate(`/place/${place?._id}`)}
            className="flex-1 py-2 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center gap-2 transition text-sm font-medium"
          >
            <FaInfoCircle /> Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
