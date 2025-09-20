import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { getRatingSummary } from "../../services/reviewServices/reviewServices";

export default function PlaceCard({ place, userLocation }) {
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
        ).toFixed(2)
      : null;

  const avgRating = ratingSummary?.average || 0;
  const totalVotes = ratingSummary?.totalVotes || 0;

  const handleClick = () => {
    navigate(`/place/${place._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className=" rounded-xl shadow-md bg-white hover:shadow-lg transition cursor-pointer overflow-hidden text-black border border-blue-500"
    >
      <img
        src={
          place?.image_url && place.image_url.trim() !== "" && place.image_url !== "NaN"
            ? place.image_url
            : "/placeholder.png"
        }
        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        alt={place?.name || "placeholder"}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col gap-2">
        <p className="font-semibold text-md">{place?.name}</p>
        {distance && <p className="text-sm text-gray-500">{distance} km</p>}

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="ml-1 text-sm font-semibold text-gray-600">
            ({totalVotes})
          </span>
        </div>
      </div>
    </div>
  );
}
