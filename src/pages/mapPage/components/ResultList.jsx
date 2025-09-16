import { useEffect, useState } from "react";
import { FaRoute, FaInfoCircle, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getRatingSummary } from "../../../services/reviewServices/reviewServices";

function PlaceCard({ place, userLocation, onDirections, onSelectPlace, loadingDirections }) {
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
    fetchRating();
  }, [place._id]);

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

  const distance = userLocation
    ? getDistanceFromLatLonInKm(
        userLocation.lat,
        userLocation.lng,
        Number(place.latitude),
        Number(place.longitude)
      ).toFixed(2)
    : null;

  const avgRating = ratingSummary?.average || 0;
  const totalVotes = ratingSummary?.totalVotes || 0;

  return (
    <div
      className="border rounded-xl p-4 shadow-md bg-white cursor-pointer hover:shadow-lg transition"
      onClick={() => onSelectPlace(place)}
    >
      <div className="flex gap-4">
        <img
          src={
            place && typeof place.image_url === "string" && place.image_url.trim() !== ""
              ? place.image_url
              : "/placeholder.png"
          }
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          alt={place?.name || "placeholder"}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border"
        />

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-lg">{place.name}</p>
            {distance && <p className="text-sm text-gray-500">{distance} km</p>}

            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">
                {totalVotes > 0 ? `${avgRating.toFixed(1)} (${totalVotes})` : "Chưa có đánh giá"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          disabled={loadingDirections}
          onClick={(e) => {
            e.stopPropagation();
            onDirections(place);
          }}
          className={`flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-white hover:text-green-500 border border-green-500 justify-center flex items-center gap-1 text-sm ${
            loadingDirections ? "opacity-50 cursor-not-allowed" : ""
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
          disabled={loadingDirections}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/place/${place._id}`);
          }}
          className={`flex-1 border border-blue-500 text-blue-500 py-2 rounded-xl hover:bg-blue-500 hover:text-white justify-center flex items-center gap-2 transition text-sm ${
            loadingDirections ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaInfoCircle /> Chi tiết
        </button>
      </div>
    </div>
  );
}

function ResultList({
  results,
  onDirections,
  onSelectPlace,
  loadingDirections,
  userLocation,
  loading,
  searched,
}) {
  if (!searched) {
    return <p className="text-gray-500 mt-4 text-center">Nhập từ khóa để tìm kiếm.</p>;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-6 space-y-2">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Đang tìm kiếm...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return <p className="text-gray-500 mt-4 text-center">Không tìm thấy kết quả nào.</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Kết quả tìm kiếm ({results.length})
      </h3>
      <div className="space-y-3">
        {results.map((place, idx) => (
          <PlaceCard
            key={idx}
            place={place}
            userLocation={userLocation}
            onDirections={onDirections}
            onSelectPlace={onSelectPlace}
            loadingDirections={loadingDirections}
          />
        ))}
      </div>
    </div>
  );
}

export default ResultList;
