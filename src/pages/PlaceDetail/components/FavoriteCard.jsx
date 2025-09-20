import { useState, useEffect } from "react";
import { FaHeart, FaRoute } from "react-icons/fa";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { toggleFavorite } from "../../../services/favoriteServices/favouriteService";
import { toast } from "react-toastify";
import AnimatedButton from "../../../components/Button/AnimatedButton";

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

  const handleDirections = () => {
    const url = `/map/?q=${encodeURIComponent(place.name)}&cat=&r=100&directions=${place._id}`;
    navigate(url);
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-4">
      </div>

      {/* Nút chỉ đường */}
      <AnimatedButton
        onClick={handleDirections}
        className="flex items-center gap-2 bg-green-500 text-white hover:bg-white hover:text-green-500 border border-green-500 shadow-lg text-sm"
      >
        <FaRoute /> Chỉ đường
      </AnimatedButton>

      {/* Nút toggle favorite */}
      <AnimatedButton
        onClick={handleToggleFavorite}
        className={`flex items-center gap-2 border shadow-lg text-sm ${
          isFavorited
            ? "bg-white text-red-500 hover:bg-red-500 hover:text-white border-red-500"
            : "bg-red-500 text-white hover:bg-white hover:text-red-500 border-red-500"
        }`}
      >
        <FaHeart
          size={20}
          className={`transition-transform duration-200 
            ${isBouncing ? "animate-bounce-heart" : ""}`}
        />
        {isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
      </AnimatedButton>


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
