import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlaceCard from "../../components/Card/PlaceCard";
import { FaHeart, FaMapMarkedAlt, FaSearch, FaFilter, FaList, FaMap } from "react-icons/fa";
import MapView from "../mapPage/components/MapView";
import "./CustomProfile.css"
export default function ProfileDetailList({ loading, data }) {
  const [flyToPosition, setFlyToPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("split");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.length > 0) {
      setFlyToPosition([data[0].latitude, data[0].longitude]);
    }
  }, [data]);

  const filteredData =
    data?.filter(
      (place) =>
        place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.address?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></div>
          <div className="h-6 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/5 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/50 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:flex-1 h-[500px] lg:h-[700px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaMapMarkedAlt className="text-gray-400 text-3xl" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-600 mb-3">
          Chưa có địa điểm ưa thích
        </h3>
        <p className="text-gray-500 text-lg mb-6">
          Hãy khám phá và thêm những địa điểm yêu thích của bạn!
        </p>
        <button
          type="button"
          onClick={() => {
            console.log("clicked navigate");
            navigate("/place");
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <FaSearch className="text-sm" />
          Khám phá ngay
        </button>
      </div>
    );
  }

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setFlyToPosition([place.latitude, place.longitude]);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaHeart className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Địa điểm ưa thích</h2>
            <p className="text-gray-600">
              {filteredData.length} địa điểm
              {searchTerm && ` (đã lọc từ ${data.length})`}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 w-full sm:w-64"
            />
          </div>
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaList className="text-sm" />
              <span className="hidden sm:inline">Danh sách</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === "split"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaFilter className="text-sm" />
              <span className="hidden sm:inline">Kết hợp</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === "map"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaMap className="text-sm" />
              <span className="hidden sm:inline">Bản đồ</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col ${
          viewMode === "split" ? "lg:flex-row" : ""
        } gap-8`}
      >
        {(viewMode === "list" || viewMode === "split") && (
          <div
            className={`${
              viewMode === "split" ? "w-full lg:w-2/5" : "w-full"
            } ${viewMode === "split" ? "max-h-[700px]" : ""} overflow-y-auto`}
          >
            {filteredData.length > 0 ? (
              <div className="space-y-4 p-4">
                {filteredData.map((place, idx) => (
                  <div
                    key={`${place.id || idx}-${idx}`}
                    className={`cursor-pointer transform hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden ${
                      selectedPlace?.id === place.id
                        ? "ring-2 ring-blue-500 shadow-xl"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => handlePlaceClick(place)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handlePlaceClick(place);
                      }
                    }}
                  >
                    <PlaceCard place={place} clickable={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  Không tìm thấy địa điểm nào phù hợp
                </p>
                <p className="text-gray-400">Thử thay đổi từ khóa tìm kiếm</p>
              </div>
            )}
          </div>
        )}
        {(viewMode === "map" || viewMode === "split") && filteredData.length > 0 && (
          <div
            className={`${
              viewMode === "split" ? "w-full lg:flex-1" : "w-full"
            } h-[500px] ${
              viewMode === "split" ? "lg:h-[700px]" : "lg:h-[600px]"
            } rounded-2xl shadow-xl overflow-hidden border border-white/20`}
          >
            <MapView
              userLocation={{
                lat: filteredData[0].latitude,
                lng: filteredData[0].longitude,
              }}
              results={filteredData}
              route={null}
              radius={1}
              flyToPosition={flyToPosition}
              onMarkerClick={(pos) => setFlyToPosition(pos)}
            />
          </div>
        )}
      </div>

      {selectedPlace && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Đã chọn:</h3>
          <p className="text-blue-600 font-medium">{selectedPlace.name}</p>
          {selectedPlace.address && (
            <p className="text-gray-600 text-sm">{selectedPlace.address}</p>
          )}
        </div>
      )}
    </div>
  );
}
