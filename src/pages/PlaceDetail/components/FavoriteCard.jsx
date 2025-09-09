import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { toggleFavorite } from "../../../services/favoriteServices/favouriteService";

export default function FavoriteCard({ place }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favoriteCount, setFavoriteCount] = useState(place.favorite_count || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleToggleFavorite = async () => {
    if (!user) {
      setShowLoginModal(true);
      setTimeout(() => {
        setShowLoginModal(false);
        navigate("/auth");
      }, 1000);
      return;
    }

    try {
      const res = await toggleFavorite(place._id);
      setFavoriteCount(res.favorite_count);
      setIsFavorited(!isFavorited);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 1200);
    } catch (err) {
      console.error("Lỗi khi toggle favorite:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-1/3 text-center relative">
      {/* Title */}
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Yêu thích</h3>

      {/* Heart + count */}
      <div className="flex justify-center items-center gap-4 mb-2">
        <FaHeart
          size={32}
          onClick={handleToggleFavorite}
          className={`cursor-pointer transition-all duration-200 ${
            isFavorited
              ? "text-red-500 drop-shadow-md transform scale-125"
              : "text-gray-300 hover:text-red-400"
          }`}
        />
        <span className="text-lg font-bold text-gray-900">
          {favoriteCount}
        </span>
      </div>

      {/* Description */}
      {favoriteCount > 0 ? (
        <p className="text-sm text-gray-500">
          {favoriteCount} người đã yêu thích
        </p>
      ) : (
        <p className="text-sm text-gray-500">Chưa có ai yêu thích</p>
      )}

      {/* Modal login */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white px-8 py-4 rounded-lg shadow-lg text-lg font-medium text-gray-700">
            Bạn cần đăng nhập để yêu thích địa điểm
          </div>
        </div>
      )}

      {/* Modal success */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white px-8 py-4 rounded-lg shadow-lg text-lg font-bold text-green-600">
            Cập nhật yêu thích thành công!
          </div>
        </div>
      )}
    </div>
  );
}
