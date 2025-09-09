import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { getReviews, createReview, updateReview, deleteReview } from "../../../../services/reviewServices/reviewServices";
import { getUserById } from "../../../../services/userServices/getUserByID";
import ReviewCard from "./ReviewCard";
import CommentForm from "./CommentForm";

export default function CommentSection({ placeId, place }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0); // <- mặc định 0
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState("view"); // "view" | "write"

  const userCache = {};

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(placeId);
      const filtered = data.filter((r) => r.comment && r.comment.trim() !== "");

      const enrichedReviews = await Promise.all(
        filtered.map(async (r) => {
          if (typeof r.user_id === "string") {
            if (!userCache[r.user_id]) {
              try {
                const userData = await getUserById(r.user_id);
                userCache[r.user_id] = {
                  _id: userData._id,
                  name: userData.name || "Người dùng",
                  avatar_url: userData.avatar_url || "/src/assets/avatar-placeholder.png",
                };
              } catch {
                userCache[r.user_id] = {
                  _id: r.user_id,
                  name: "Người dùng",
                  avatar_url: "/src/assets/avatar-placeholder.png",
                };
              }
            }
            return { ...r, user_id: userCache[r.user_id] };
          }
          return r;
        })
      );

      setReviews(enrichedReviews);
    } catch (err) {
      console.error("Lỗi khi lấy reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [placeId]);

  const handleAddComment = async () => {
    if (!user) {
      setShowLoginModal(true);
      setTimeout(() => {
        setShowLoginModal(false);
        navigate("/auth");
      }, 1000);
      return;
    }
    if (!comment.trim()) return;
    try {
      await createReview(placeId, { rating, comment });
      setComment("");
      setRating(0); // <- reset về 0
      fetchReviews();
      setActiveTab("view");
    } catch (err) {
      console.error("Lỗi khi thêm review:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa review:", err);
    }
  };

  const handleSaveEdit = async (id, newComment) => {
    try {
      await updateReview(id, { comment: newComment });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, comment: newComment } : r))
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật review:", err);
    }
  };

  return (
    <div className="p-6 mt-6 w-full">

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("view")}
          className={`px-4 py-2 font-medium transition-colors duration-200 bg-transparent ${
            activeTab === "view" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
        >
          Xem bình luận
        </button>
        <button
          onClick={() => setActiveTab("write")}
          className={`px-4 py-2 font-medium transition-colors duration-200 bg-transparent ${
            activeTab === "write" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
        >
          Viết bình luận
        </button>
      </div>

      {/* Tab content */}
      <div className="relative min-h-[300px]">
        {activeTab === "view" && (
          <>
            {loading ? (
              <p>Đang tải bình luận...</p>
            ) : reviews.length === 0 ? (
              <p>Chưa có bình luận nào.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {reviews.map((r) => (
                  <ReviewCard
                    key={r._id}
                    review={r}
                    currentUserId={user?._id}
                    onDelete={handleDelete}
                    onSave={handleSaveEdit}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "write" && (
          <CommentForm
            comment={comment}
            setComment={setComment}
            rating={rating}
            setRating={setRating}
            hover={hover}
            setHover={setHover}
            onSubmit={handleAddComment}
            currentUser={user}
            place={place} // truyền place chuẩn
          />
        )}
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white px-8 py-4 rounded-lg shadow-lg text-lg font-medium text-gray-700">
            Bạn cần đăng nhập để bình luận
          </div>
        </div>
      )}
    </div>
  );
}
