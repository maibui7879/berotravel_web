import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { createReview, getRatingSummary } from "../../../services/reviewServices/reviewServices";
import { toast } from "react-toastify";

export default function RatingCard({ ratingSummary, setRatingSummary, placeId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRating = async (value) => {
    if (!user) {
      toast.info("Bạn cần đăng nhập để đánh giá");
      setTimeout(() => navigate("/auth"), 1000);
      return;
    }

    try {
      setRating(value);
      setLoading(true);

      // Gửi rating
      await createReview(placeId, { rating: value, comment: "" });

      // Delay 1s trước khi cập nhật summary và hiện toast
      setTimeout(async () => {
        const updatedSummary = await getRatingSummary(placeId);
        setRatingSummary(updatedSummary);
        setLoading(false);
        toast.success("Đánh giá thành công!");
      }, 1000);
    } catch (err) {
      setLoading(false);
      console.error("Lỗi khi gửi đánh giá:", err);
      toast.error("Đánh giá thất bại!");
    }
  };

  const displayRating = hover || ratingSummary?.average || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-1/3 text-center relative">
      {/* Title */}
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Đánh giá</h3>

      {/* Rating number + stars */}
      <div className="flex justify-center items-center gap-5 mb-2">
        <span className="text-3xl font-extrabold text-gray-900 flex items-baseline">
          {displayRating.toFixed(1)}
          <span className="text-sm text-gray-400 ml-1">/5</span>
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              size={28}
              onClick={() => handleRating(i + 1)}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(null)}
              className={`cursor-pointer transition-all duration-200 ${
                displayRating > i
                  ? "text-yellow-400 drop-shadow-md transform scale-125"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Total votes */}
      {ratingSummary && ratingSummary.totalVotes > 0 ? (
        <p className="text-sm text-gray-500 mt-1">
          {ratingSummary.totalVotes} lượt đánh giá
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-1">Hiện chưa có ai đánh giá</p>
      )}

      {/* Overlay loading */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-xl z-40">
          <div className="loader border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
}
