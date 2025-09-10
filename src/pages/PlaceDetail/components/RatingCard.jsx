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

      await createReview(placeId, { rating: value, comment: "" });

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
  const totalVotes = ratingSummary?.totalVotes || 0;
  const distribution = ratingSummary?.distribution || {};

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-1/3 text-center relative">
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
      {totalVotes > 0 ? (
        <p className="text-sm text-gray-500 mt-1">{totalVotes} lượt đánh giá</p>
      ) : (
        <p className="text-sm text-gray-500 mt-1">Hiện chưa có ai đánh giá</p>
      )}

      {/* Distribution */}
      {totalVotes > 0 && (
        <div className="mt-4 space-y-2 ">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const percent = totalVotes ? (count / totalVotes) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 ">
                <span className="w-4 text-sm font-medium text-gray-700">{star}</span>
                <FaStar className="text-yellow-400" size={14} />
                <div className="flex-1 relative group">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden w-3/4">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  {/* Tooltip */}
                  {count > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-7 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition">
                      {count} lượt
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
