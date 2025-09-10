import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { toggleFavorite } from "../../../services/favoriteServices/favouriteService";
import { toast } from "react-toastify";

export default function FavoriteCard({ place }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [favoriteCount, setFavoriteCount] = useState(place.favorite_count || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (user?.favorites?.includes(place._id)) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [user, place._id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.info("Bạn cần đăng nhập để yêu thích địa điểm");
      setTimeout(() => navigate("/auth"), 1000);
      return;
    }

    try {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 500);

      const res = await toggleFavorite(place._id);
      setFavoriteCount(res.favorite_count);
      setIsFavorited(res.is_favorited ?? !isFavorited);
      toast.success("Cập nhật yêu thích thành công!");
    } catch (err) {
      console.error("Lỗi khi toggle favorite:", err);
      toast.error("Cập nhật yêu thích thất bại!");
    }
  };

  return (
    <div className="flex flex-row items-center space-x-2">
      <FaHeart
        size={30}
        onClick={handleToggleFavorite}
        className={`cursor-pointer transition-transform duration-200 ${
          isFavorited
            ? "text-red-500 drop-shadow-md"
            : "text-transparent stroke-red-500 hover:text-red-400 hover:fill-red-400"
        } ${isBouncing ? "animate-bounce-heart" : ""}`}
        style={{ strokeWidth: 10 }}
      />
      <p className="text-lg text-gray-500 mt-4">
        <span className="font-bold text-red-500">{favoriteCount} </span>
      </p>
      <style>
        {`
          @keyframes bounce-heart {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.3); }
            50% { transform: scale(0.9); }
            75% { transform: scale(1.1); }
          }
          .animate-bounce-heart {
            animation: bounce-heart 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
