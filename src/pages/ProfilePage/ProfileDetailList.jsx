import { useState, useEffect } from "react";
import PlaceCard from "../../components/Card/PlaceCard";
import { FaHeart } from "react-icons/fa";
import MapView from "../mapPage/components/MapView";

export default function ProfileDetailList({ loading, data }) {
  const [flyToPosition, setFlyToPosition] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setFlyToPosition([data[0].latitude, data[0].longitude]);
    }
  }, [data]);

  if (loading) {
    return <p className="text-center text-gray-500">Đang tải chi tiết...</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-400">Không có dữ liệu</p>;
  }

  return (
    <div className="rounded-b-xl py-4 md:pr-10">
      <h2 className="font-semibold mb-4 text-xl flex items-center gap-2">
        <FaHeart className="text-red-500" />
        Địa điểm ưa thích
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Danh sách */}
        <div className="w-full md:w-1/3 max-h-[600px] overflow-y-auto pr-2">
          <div className="flex flex-col gap-4">
            {data.map((place, idx) => (
              <div
                key={idx}
                className="cursor-pointer"
                onClick={() =>
                  setFlyToPosition([place.latitude, place.longitude])
                }
              >
                <PlaceCard place={place} clickable={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className="w-full md:flex-1 h-[400px] md:h-[600px]">
          <MapView
            userLocation={{ lat: data[0].latitude, lng: data[0].longitude }}
            results={data}
            route={null}
            radius={1}
            flyToPosition={flyToPosition}
            onMarkerClick={(pos) => setFlyToPosition(pos)}
            
          />
        </div>
      </div>
    </div>
  );
}
