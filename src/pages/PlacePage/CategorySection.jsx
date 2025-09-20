import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PlaceCard from "../HomePage/PlaceCard";
import { searchNearby } from "../../services/placeServices/searchPlace";

export default function CategorySection({ userLocation, categories }) {
  const [placesByCategory, setPlacesByCategory] = useState({});
  const [loadingCategories, setLoadingCategories] = useState({});
  const [pagination, setPagination] = useState({});
  const [searchInputs, setSearchInputs] = useState({});
  const [searchQueries, setSearchQueries] = useState({});

  const fetchCategory = async (cat, page = 1, query = "") => {
    if (!userLocation) return;
    setLoadingCategories((prev) => ({ ...prev, [cat]: true }));
    try {
      const res = await searchNearby(
        userLocation.lat,
        userLocation.lng,
        10,
        query,
        cat,
        page,
        10
      );
      setPlacesByCategory((prev) => ({ ...prev, [cat]: res.data || [] }));
      setPagination((prev) => ({
        ...prev,
        [cat]: { page, totalPages: res.totalPages || 1 },
      }));
    } catch (err) {
      setPlacesByCategory((prev) => ({ ...prev, [cat]: [] }));
      setPagination((prev) => ({ ...prev, [cat]: { page: 1, totalPages: 1 } }));
    } finally {
      setLoadingCategories((prev) => ({ ...prev, [cat]: false }));
    }
  };

  useEffect(() => {
    if (!userLocation) return;
    categories.forEach((c) => fetchCategory(c.value, 1));
  }, [userLocation]);

  const handleSearch = (cat) => {
    const query = searchInputs[cat]?.trim() || "";
    setSearchQueries((prev) => ({ ...prev, [cat]: query }));
    fetchCategory(cat, 1, query);
  };

  const renderPageNumbers = (cat) => {
    const { page = 1, totalPages = 1 } = pagination[cat] || {};
    const pages = [];
    const buttonClass = (isActive) =>
      `px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-blue-700 text-white border-blue-700 border"
          : "bg-white text-blue-700 border-blue-300 border hover:bg-blue-50"
      }`;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => fetchCategory(cat, i, searchQueries[cat] || "")}
            className={buttonClass(i === page)}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          onClick={() => fetchCategory(cat, 1, searchQueries[cat] || "")}
          className={buttonClass(page === 1)}
        >
          1
        </button>
      );
      if (page > 3) pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => fetchCategory(cat, i, searchQueries[cat] || "")}
            className={buttonClass(i === page)}
          >
            {i}
          </button>
        );
      }
      if (page < totalPages - 2) pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      pages.push(
        <button
          key={totalPages}
          onClick={() => fetchCategory(cat, totalPages, searchQueries[cat] || "")}
          className={buttonClass(page === totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  const backgroundImages = {
    park:
      "https://streamline.imgix.net/c8d2a279-bd08-4d37-bb32-8e261a0a0523/15faf87b-9d28-42d4-9c4b-8d108891e1c5/Community%20Park%20Picnic%2005.01.24-9.jpg?ixlib=rb-1.1.0&w=2000&h=2000&fit=max&or=0&s=25210333454541e358896d6d90d8929e",
    restaurant:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/d5/bb/74/lounge.jpg?w=900&h=500&s=1",
    attraction:
      "https://www.visitlondon.com/-/media/images/london/visit/things-to-do/sightseeing/london-attractions/coca-cola-london-eye/the-london-eye-2-640x360.jpg?mw=640&rev=95097c3d2aab47109d7b0e944c804d1b&hash=F3E08589FAB39D902A18A111B8C7549C",
    bar: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/aa/b9/fa/caption.jpg?w=900&h=500&s=1",
  };

  return (
    <div>
      {categories.map((cat) => {
        const places = placesByCategory[cat.value] || [];
        const { page = 1, totalPages = 1 } = pagination[cat.value] || {};
        const loading = loadingCategories[cat.value];
        const bgImage = backgroundImages[cat.value];

        return (
          <div key={cat.value} className="relative w-full">
            <div
              className="relative z-0 w-full rounded-t-2xl"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.1) 40%, rgba(255,255,255,0.8) 90%, #ffffff)",
                }}
              ></div>

              <div className="relative p-8 z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                  {cat.label}
                </h2>
                <p className="text-gray-100 mt-2 text-lg">
                  Khám phá những {cat.label.toLowerCase()} gần bạn.
                </p>

                {/* SEARCH BAR */}
                <div className="flex items-center w-full md:w-1/4 bg-white/30 rounded-full shadow px-4 border-2 border-white focus-within:ring-2 focus-within:ring-blue-300 transition mt-4">
                  <input
                    type="text"
                    placeholder={`Tìm ${cat.label.toLowerCase()}...`}
                    value={searchInputs[cat.value] || ""}
                    onChange={(e) =>
                      setSearchInputs((prev) => ({
                        ...prev,
                        [cat.value]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(cat.value)}
                    className="flex-1 outline-none text-white placeholder-white/70 py-2 bg-transparent text-left"
                  />
                  <button
                    onClick={() => handleSearch(cat.value)}
                    className="ml-3 text-white hover:text-blue-100 p-2 rounded-full transition"
                  >
                    <FaSearch />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mt-6 relative">
                  {loading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20 rounded-2xl">
                      <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {places.length === 0 && !loading && (
                    <p className="text-red-500 text-lg mt-4">
                      Không tìm thấy địa điểm nào.
                    </p>
                  )}

                  {places.map((place, idx) => (
                    <div
                      key={place._id || idx}
                      className="transform transition duration-300 hover:scale-105"
                    >
                      <PlaceCard place={place} userLocation={userLocation} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-8">
                    <button
                      disabled={page === 1}
                      onClick={() =>
                        fetchCategory(cat.value, page - 1, searchQueries[cat.value] || "")
                      }
                      className={`px-2 py-2 rounded-lg border ${
                        page === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white"
                      }`}
                    >
                      <FaChevronLeft />
                    </button>

                    {renderPageNumbers(cat.value)}

                    <button
                      disabled={page === totalPages}
                      onClick={() =>
                        fetchCategory(cat.value, page + 1, searchQueries[cat.value] || "")
                      }
                      className={`px-2 py-2 rounded-lg border ${
                        page === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white"
                      }`}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
