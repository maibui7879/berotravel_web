// src/components/ResultList.jsx
import { FaRoute, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PlaceCard({ place, userLocation, onDirections, onSelectPlace, loadingDirections }) {
  const navigate = useNavigate();

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

  return (
    <div
      className="border rounded-xl p-4 shadow-md bg-white cursor-pointer hover:shadow-lg transition"
      onClick={() => onSelectPlace(place)}
    >
      <p className="font-semibold text-lg">{place.name}</p>
      {distance && <p className="text-sm text-gray-500">{distance} km</p>}

      <div className="flex gap-2 mt-3">
        {/* Chỉ đường */}
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
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <>
              <FaRoute /> Chỉ đường
            </>
          )}
        </button>

        {/* Chi tiết */}
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

export default function ResultList({
  results,
  onDirections,
  onSelectPlace,
  loadingDirections,
  userLocation,
}) {
  if (!results || results.length === 0) {
    return <p className="text-gray-500 mt-4 text-center">Ngủ đi.</p>;
  }

  return (
    <div className="space-y-3 mt-4">
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
  );
}
