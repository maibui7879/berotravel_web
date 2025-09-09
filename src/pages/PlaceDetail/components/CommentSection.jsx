import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../../services/reviewServices/reviewServices";
import { getUserById } from "../../../services/userServices/getUserByID";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaStar } from "react-icons/fa";

export default function CommentSection({ placeId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const userCache = {}; // cache tên user để không gọi nhiều lần

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(placeId);
      const filtered = data.filter((r) => r.comment && r.comment.trim() !== "");

      const enrichedReviews = await Promise.all(
        filtered.map(async (r) => {
          // Nếu user là string (id) thì gọi API
          if (typeof r.user_id_id === "string") {
            if (!userCache[r.user_id]) {
              try {
                const userData = await getUserById(r.user_id);
                userCache[r.user_id] = { _id: r.user_id, name: userData.name, avatar_url: userData.avatar_url || "" };
              } catch {
                userCache[r.user_id] = { _id: r.user_id, name: "Người dùng" };
              }
            }
            return { ...r, user: userCache[r.user_id] };
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
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error("Lỗi khi thêm review:", err);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa review:", err);
    }
  };

  const handleEditComment = (review) => {
    setEditingId(review._id);
    setEditText(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await updateReview(id, { comment: editText });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, comment: editText } : r))
      );
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Lỗi khi cập nhật review:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6 w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Bình luận</h3>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              size={24}
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(null)}
              className={`cursor-pointer transition-all duration-200 ${
                (hover || rating) > i
                  ? "text-yellow-400 drop-shadow-md transform scale-125"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Gửi
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải bình luận...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">Chưa có bình luận nào.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <div key={r._id} className="flex items-start gap-3 border-b pb-3">
              <img
                src={r.user_id?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    {r.user_id?.name || "Người dùng"}
                  </span>
                  {user && user._id === r.user_id?._id && (
                    <div className="flex gap-2">
                      {editingId === r._id ? (
                        <>
                          <FaCheck
                            className="text-green-500 cursor-pointer"
                            onClick={() => handleSaveEdit(r._id)}
                          />
                          <FaTimes
                            className="text-gray-500 cursor-pointer"
                            onClick={handleCancelEdit}
                          />
                        </>
                      ) : (
                        <>
                          <FaEdit
                            className="text-blue-500 cursor-pointer"
                            onClick={() => handleEditComment(r)}
                          />
                          <FaTrash
                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                            onClick={() => handleDeleteComment(r._id)}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      size={16}
                      className={`${r.rating > i ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                {editingId === r._id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full mt-1 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p className="text-gray-700 mt-1">{r.comment}</p>
                )}
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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
