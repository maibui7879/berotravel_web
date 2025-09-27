import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PlaceCard from "../HomePage/PlaceCard";
import { searchNearby } from "../../services/placeServices/searchPlace";

export default function RecommendedSection({ userLocation }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userLocation) return;

    const fetchRecommended = async () => {
      setLoading(true);
      try {
        const res = await searchNearby(
          userLocation.lat,
          userLocation.lng,
          5,
          searchQuery || "",
          "",
          page,
          10
        );

        setRecommended(res.data || []);
        setTotalPages(res.totalPages || 1);

        setSearchParams({
          q: searchQuery || "",
          page: page.toString(),
        });
      } catch (err) {
        console.error("Lỗi khi lấy recommended:", err);
        setRecommended([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [userLocation, searchQuery, page, setSearchParams]);

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput.trim() || null);
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded-lg border text-sm font-medium ${
              i === page
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          onClick={() => setPage(1)}
          className={`px-3 py-1 rounded-lg border text-sm font-medium ${
            page === 1
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
          }`}
        >
          1
        </button>
      );

      if (page > 3) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-white">
            ...
          </span>
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded-lg border text-sm font-medium ${
              i === page
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
            }`}
          >
            {i}
          </button>
        );
      }

      if (page < totalPages - 2) {
        pages.push(
          <span key="middle-ellipsis" className="px-2 text-white">
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          className={`px-3 py-1 rounded-lg border text-sm font-medium ${
            page === totalPages
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <section
      className="px-8 md:px-12 pt-20 md:pt-32 pb-16 relative overflow-hidden "
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/01/02/64/28/360_F_102642850_Mca9lTRDH60DQin39YwCF5Jzd15lcdoo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay gradient từ đen → trong suốt → trắng */}
      <div className="absolute inset-0 -z-10" style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.1) 40%, rgba(255,255,255,0.8) 90%, #ffffff)"
      }}></div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
        Gợi ý cho bạn
      </h2>

      <p className="text-white/90 mb-6">
        Khám phá những địa điểm gần bạn.
      </p>

      <div className="flex items-center w-full md:w-1/4 bg-white/30 rounded-full shadow px-4 border-2 border-white focus-within:ring-2 focus-within:ring-blue-300 transition">
        <input
          type="text"
          placeholder="Tìm địa điểm..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 outline-none text-white placeholder-white/70 py-2 bg-transparent text-left"
        />
        <button
          onClick={handleSearch}
          className="ml-3 text-white hover:text-blue-100 p-2 rounded-full transition"
        >
          <FaSearch />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mt-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20 rounded-2xl">
            <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {recommended.map((place) => (
          <PlaceCard key={place._id} place={place} userLocation={userLocation} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-6">
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`p-2 rounded-lg border ${
                page === 1 || loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <FaChevronLeft />
            </button>

            {renderPageNumbers()}

            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`p-2 rounded-lg border ${
                page === totalPages || loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
