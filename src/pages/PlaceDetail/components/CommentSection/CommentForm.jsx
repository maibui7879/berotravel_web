import { FaStar } from "react-icons/fa";

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
  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-3xl shadow-xl w-full md:w-1/2 mx-auto border border-gray-200">

      {/* Header của form: thông tin nhà hàng + user */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <img
          src={place?.image_url || "/src/assets/avatar-placeholder.png"}
          alt={place?.name || "Place"}
          className="w-16 h-16 rounded-xl object-cover shadow-md"
        />
        <div className="flex flex-col">
          <div className="text-gray-900 font-bold text-lg">{place?.name || "Nhà hàng"}</div>
          {place?.address && (
            <div className="text-gray-500 text-sm flex items-center gap-1">{place.address}</div>
          )}
          <div className="text-gray-700 text-sm mt-1">
            Bình luận với tư cách <span className="text-blue-600">{currentUser?.name || "Khách"}</span>
          </div>
        </div>
      </div>

      {/* Title đánh giá */}
      <b className="ml-2">Đánh giá của bạn:</b>

      {/* Rating Stars (mặc định rỗng) */}
      <div className="flex items-center gap-3 mt-2">
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

      {/* Comment Textarea */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={currentUser ? "Viết đánh giá cụ thể..." : "Bạn cần đăng nhập để bình luận"}
        className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400 text-gray-900 resize-none shadow-sm transition-all duration-200 hover:shadow-md"
        rows={5}
        disabled={!currentUser}
      />

      {/* Submit Button */}
      <div className="flex justify-start">
        <button
          onClick={onSubmit}
          disabled={!currentUser || !comment.trim()}
          className="bg-blue-600 text-white font-semibold px-7 py-3 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Gửi bình luận
        </button>
      </div>
    </div>
  );
}
