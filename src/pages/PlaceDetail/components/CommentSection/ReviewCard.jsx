import { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {
  createOrUpdateVote,
  getVotesByTarget,
  deleteVote,
} from "../../../../services/voteServices/voteServices";

export default function ReviewCard({
  review,
  currentUserId,
  onDelete,
  onVoteChange,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [voteCounts, setVoteCounts] = useState({ up: 0, down: 0 });
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const formattedDate = new Date(review.createdAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const votes = await getVotesByTarget(review._id, "Review");
        const up = votes.filter((v) => v.vote_type === "upvote").length;
        const down = votes.filter((v) => v.vote_type === "downvote").length;
        setVoteCounts({ up, down });

        if (user) {
          const myVote = votes.find((v) => v.user_id === user._id);
          setUserVote(myVote ? (myVote.vote_type === "upvote" ? 1 : -1) : null);
        }
      } catch (err) {
        console.error("Lỗi khi lấy vote:", err);
      }
    };
    fetchVotes();
  }, [review._id, user]);

  const handleDelete = () => {
    onDelete && onDelete(review._id);
    toast.success("Đã xóa bình luận!");
    setShowConfirm(false);
  };

  const handleVote = async (value) => {
    if (!user) {
      toast.info("Bạn cần đăng nhập để vote");
      setTimeout(() => navigate("/auth"), 1000);
      return;
    }

    try {
      setLoading(true);
      if (userVote === value) {
        await deleteVote(review._id);
        setUserVote(null);
        const newVotes =
          value === 1
            ? { ...voteCounts, up: voteCounts.up - 1 }
            : { ...voteCounts, down: voteCounts.down - 1 };
        setVoteCounts(newVotes);
        onVoteChange && onVoteChange(review._id, newVotes);
      } else {
        const payload = {
          target_id: review._id,
          target_type: "Review",
          vote_type: value === 1 ? "upvote" : "downvote",
        };
        await createOrUpdateVote(payload);

        let newVotes;
        if (userVote !== null) {
          newVotes =
            value === 1
              ? { up: voteCounts.up + 1, down: voteCounts.down - 1 }
              : { up: voteCounts.up - 1, down: voteCounts.down + 1 };
        } else {
          newVotes =
            value === 1
              ? { ...voteCounts, up: voteCounts.up + 1 }
              : { ...voteCounts, down: voteCounts.down + 1 };
        }

        setVoteCounts(newVotes);
        setUserVote(value);
        onVoteChange && onVoteChange(review._id, newVotes);
      }

      toast.success("Cập nhật vote thành công!");
    } catch (err) {
      console.error("Lỗi khi vote:", err?.response?.data || err);
      toast.error("Vote thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const truncatedComment =
    review.comment.length > 20 && !showFullText
      ? review.comment.slice(0, 20) + "..."
      : review.comment;

  return (
    <div className="bg-white mt-16 rounded-3xl p-8 pt-20 relative shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl w-full mx-auto border border-gray-200">
      {currentUserId === review.user_id?._id && (
        <span
          className="absolute top-4 right-4 text-red-500 font-bold text-xl cursor-pointer hover:text-red-600"
          onClick={() => setShowConfirm(true)}
        >
          ×
        </span>
      )}

      <div className="rounded-full absolute -top-16 border-8 border-gray-200 shadow-md">
        <img
          src={
            review.user_id?.avatar_url || "/src/assets/avatar-placeholder.png"
          }
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      <span className="font-bold text-lg md:text-xl text-gray-800 mt-2">
        {review.user_id?.name}
      </span>
      <span className="text-gray-400 text-sm">
        Đăng tải vào {formattedDate}
      </span>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-2xl font-extrabold text-gray-900 flex items-baseline">
          {review.rating}
          <span className="text-sm text-gray-400 ml-1">/5</span>
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              size={20}
              className={`${
                review.rating > i
                  ? "text-yellow-400 drop-shadow-md transform scale-125"
                  : "text-gray-300"
              } transition-all duration-200`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-600 mt-4 text-sm md:text-base italic bg-gray-50 px-5 py-4 rounded-2xl border border-gray-200 w-full">
        {truncatedComment}
        {review.comment.length > 20 && (
          <span
            className="text-blue-500 cursor-pointer ml-1"
            onClick={() => setShowFullText(!showFullText)}
          >
            {showFullText ? "thu gọn" : "xem thêm"}
          </span>
        )}
      </p>

      <i className="text-gray-500 text-sm mt-3">
        Bình luận này có hữu ích không?
      </i>

      <div className="flex items-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <FaArrowUp
            size={18}
            onClick={() => handleVote(1)}
            className={`cursor-pointer transition-transform duration-200 ${
              userVote === 1
                ? "text-green-500 scale-125"
                : "text-gray-400 hover:text-green-400"
            }`}
          />
          <span className="font-semibold text-gray-700">{voteCounts.up}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaArrowDown
            size={18}
            onClick={() => handleVote(-1)}
            className={`cursor-pointer transition-transform duration-200 ${
              userVote === -1
                ? "text-red-500 scale-125"
                : "text-gray-400 hover:text-red-400"
            }`}
          />
          <span className="font-semibold text-gray-700">{voteCounts.down}</span>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center border border-gray-200">
            <p className="text-gray-800 font-medium mb-4">
              Bạn có chắc chắn muốn xóa bình luận này?
            </p>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600"
                onClick={handleDelete}
              >
                Xóa
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl shadow hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-3xl z-40">
          <div className="loader border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
}
