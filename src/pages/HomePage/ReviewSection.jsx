// components/ReviewSection.jsx
import { useEffect, useState } from "react";
import { FaStar, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getPlaceById } from "../../services/placeServices/getPlace";
import { useAuth } from "../../contexts/authContext";
import { createOrUpdateVote, getVotesByTarget, deleteVote } from "../../services/voteServices/voteServices";
import { toast } from "react-toastify";

export default function ReviewSection({ review }) {
  const [placeName, setPlaceName] = useState("");
  const [voteCounts, setVoteCounts] = useState({ up: 0, down: 0 });
  const [userVote, setUserVote] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlaceName = async () => {
      try {
        const place = await getPlaceById(review.place_id);
        setPlaceName(place.name);
      } catch (err) {
        console.error("Lỗi khi lấy tên địa điểm:", err);
      }
    };
    fetchPlaceName();
  }, [review.place_id]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const votes = await getVotesByTarget(review._id, "Review");
        const up = votes.filter(v => v.vote_type === "upvote").length;
        const down = votes.filter(v => v.vote_type === "downvote").length;
        setVoteCounts({ up, down });

        if (user) {
          const myVote = votes.find(v => v.user_id === user._id);
          setUserVote(myVote ? (myVote.vote_type === "upvote" ? 1 : -1) : null);
        }
      } catch (err) {
        console.error("Lỗi khi lấy vote:", err);
      }
    };
    fetchVotes();
  }, [review._id, user]);

  const handleVote = async (value) => {
    if (!user) {
      toast.info("Bạn cần đăng nhập để vote");
      setTimeout(() => navigate("/auth"), 1000);
      return;
    }
    try {
      if (userVote === value) {
        await deleteVote(review._id);
        setUserVote(null);
        setVoteCounts(prev => value === 1 ? { ...prev, up: prev.up - 1 } : { ...prev, down: prev.down - 1 });
      } else {
        await createOrUpdateVote({ target_id: review._id, target_type: "Review", vote_type: value === 1 ? "upvote" : "downvote" });
        setVoteCounts(prev => {
          if (userVote === null) return value === 1 ? { ...prev, up: prev.up + 1 } : { ...prev, down: prev.down + 1 };
          return value === 1 ? { up: prev.up + 1, down: prev.down - 1 } : { up: prev.up - 1, down: prev.down + 1 };
        });
        setUserVote(value);
      }
      toast.success("Cập nhật vote thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Vote thất bại!");
    }
  };

  const formattedDate = new Date(review.createdAt).toLocaleDateString("vi-VN", {
    year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="bg-white rounded-2xl p-6 pt-16 relative shadow-lg flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-3 hover:shadow-2xl min-h-[20rem] w-full mx-auto shadow-t-lg">
      <div className="rounded-full absolute -top-12 border-8 border-gray-50">
        <img
          src={review.user_id?.avatar_url || "/src/assets/avatar-placeholder.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
      </div>

      <div className="mt-2 text-center">
        <span className="font-bold text-lg md:text-xl text-gray-800">{review.user_id?.name}</span>
        {placeName && (
          <>
            <span className="text-gray-500 mx-1 text-sm">đã nhận xét về</span>
            <span
              onClick={() => navigate(`/place/${review.place_id}`)}
              className="font-semibold cursor-pointer hover:font-bold"
            >
              {placeName}
            </span>
          </>
        )}
      </div>

      <span className="text-gray-400 text-sm mt-1">Đăng tải vào {formattedDate}</span>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-2xl font-extrabold text-gray-900 flex items-baseline">
          {review.rating}<span className="text-sm text-gray-400 ml-1">/5</span>
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              size={20}
              className={`${review.rating > i ? "text-yellow-400 drop-shadow-md transform scale-125" : "text-gray-300"} transition-all duration-200`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-500 mt-4 text-base md:text-lg italic bg-gray-100 px-4 py-3 rounded-lg border-l-4 border-blue-400 w-full">
        {review.comment}
      </p>

      <i className="text-gray-500 text-sm mt-2">Bình luận này có hữu ích không?</i>
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-1">
          <FaArrowUp size={16} onClick={() => handleVote(1)} className={`cursor-pointer transition-transform duration-200 ${userVote === 1 ? "text-green-500 scale-125" : "text-gray-400 hover:text-green-400"}`} />
          <span className="font-semibold text-gray-700">{voteCounts.up}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaArrowDown size={16} onClick={() => handleVote(-1)} className={`cursor-pointer transition-transform duration-200 ${userVote === -1 ? "text-red-500 scale-125" : "text-gray-400 hover:text-red-400"}`} />
          <span className="font-semibold text-gray-700">{voteCounts.down}</span>
        </div>
      </div>
    </div>
  );
}
