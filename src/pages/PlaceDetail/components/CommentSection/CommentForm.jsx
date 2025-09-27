import { FaStar } from "react-icons/fa";
import AnimatedButton from "../../../../components/Button/AnimatedButton";
import { useState } from "react";
import { toast } from "react-toastify";
import FloatingTextarea from "../../../../components/Input/FloatingTextArea";

export default function CommentForm({
  comment,
  setComment,
  rating,
  setRating,
  hover,
  setHover,
  onSubmit,
  currentUser,
  place,
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    try {
      setLoading(true);
      await onSubmit();
      toast.success("Comment thành công!");
      setComment("");
      setRating(0);
    } catch (err) {
      console.error("Lỗi gửi bình luận:", err);
      toast.error("Không thể gửi bình luận, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-3xl shadow-lg w-full md:w-2/3 mx-auto border border-gray-200">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <img
          src={
            place?.image_url && place.image_url !== "NaN"
              ? place.image_url
              : "/placeholder.png"
          }
          alt={place?.name || "Place"}
          className="w-16 h-16 rounded-2xl object-cover shadow-md"
        />
        <div className="flex flex-col">
          <div className="text-gray-900 font-bold text-lg">
            {place?.name || "Nhà hàng"}
          </div>
          {place?.address && (
            <div className="text-gray-500 text-sm flex items-center gap-1">
              {place.address}
            </div>
          )}
          <div className="text-gray-700 text-sm mt-1">
            Bình luận với tư cách{" "}
            <span className="text-blue-600 font-semibold">
              {currentUser?.name || "Khách"}
            </span>
          </div>
        </div>
      </div>

      <span className="text-gray-800 font-semibold text-base">Đánh giá của bạn:</span>

      <div className="flex items-center gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            size={32}
            className={`cursor-pointer transition-transform duration-200 ${
              (hover !== null ? hover : rating) > i
                ? "text-yellow-400 scale-125 drop-shadow-lg hover:scale-150"
                : "text-gray-300 hover:text-yellow-300 hover:scale-110"
            }`}
            onClick={() => setRating(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </div>

      <FloatingTextarea
        label={"Viết đánh giá của bạn..."}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={
          currentUser
            ? "Hãy chia sẻ trải nghiệm của bạn..."
            : "Bạn cần đăng nhập để bình luận"
        }
        className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400 text-gray-900 resize-none shadow-sm transition-all duration-200 hover:shadow-md"
        rows={5}
        disabled={!currentUser}
      />

      <div className="flex justify-start">
        <AnimatedButton
          onClick={handleSubmit}
          disabled={!currentUser || !comment.trim() || loading}
          className="bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2 px-6 py-3 rounded-2xl shadow-md"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Gửi bình luận"
          )}
        </AnimatedButton>
      </div>
    </div>
  );
}
