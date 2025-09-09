import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { createReview, getRatingSummary } from "../../../services/reviewServices/reviewServices";

export default function RatingCard({ ratingSummary, setRatingSummary, placeId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRating = async (value) => {
    if (!user) {
      setShowLoginModal(true);
      setTimeout(() => {
        setShowLoginModal(false);
        navigate("/auth");
      }, 1000);
      return;
    }
    try {
      setRating(value);
      await createReview(placeId, { rating: value, comment: "" });
      setShowSuccessModal(true);
      const updatedSummary = await getRatingSummary(placeId);
      setRatingSummary(updatedSummary);
      setTimeout(() => setShowSuccessModal(false), 1200);
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
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

      {/* Modal login full màn hình */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white px-8 py-4 rounded-lg shadow-lg text-lg font-medium text-gray-700">
            Bạn cần đăng nhập để đánh giá
          </div>
        </div>
      )}

      {/* Modal success full màn hình */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white px-8 py-4 rounded-lg shadow-lg text-lg font-bold text-green-600">
            Đánh giá thành công!
          </div>
        </div>
      )}
    </div>
  );
}
