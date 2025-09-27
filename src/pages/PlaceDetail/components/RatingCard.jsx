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
    <div className="relative group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/30 backdrop-blur-sm p-8 w-full md:w-3/4 -mt-10">
      {/* Floating Icon */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center border-4 border-white shadow-xl transform group-hover:rotate-6 transition-all duration-300 ">
        <FaStar className="text-white text-2xl" />
      </div>

      <h3 className="text-2xl font-bold mb-6 text-center text-yellow-700 mt-6">Đánh giá</h3>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center md:items-start">
        {/* Rating tổng quan */}
        <div className="flex flex-col items-center gap-2 w-full md:w-auto">
          <span className="text-4xl font-extrabold text-gray-900 flex items-baseline">
            {displayRating.toFixed(1)}
            <span className="text-sm text-gray-400 ml-1">/5</span>
          </span>
          <div className="flex gap-2 mt-2">
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
          <p className="text-sm text-gray-600 mt-2 text-center md:text-left">
            {totalVotes > 0 ? `${totalVotes} lượt đánh giá` : "Hiện chưa có ai đánh giá"}
          </p>
        </div>

        {/* Distribution */}
        {totalVotes > 0 && (
          <div className="flex-1 space-y-4 w-full">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percent = totalVotes ? (count / totalVotes) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-4 text-sm font-medium text-gray-700">{star}</span>
                  <FaStar className="text-yellow-400" size={16} />
                  <div className="flex-1 relative group">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    {count > 0 && (
                      <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition">
                        {count} lượt
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Overlay loading */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-2xl z-40">
          <div className="border-4 border-t-4 border-gray-200 border-t-yellow-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
}
