// src/services/voteService.js
import API from "../api";

// Tạo hoặc cập nhật vote
export const createOrUpdateVote = async (voteData) => {
  const res = await API.post("/votes", voteData);
  return res.data;
};

// Lấy tất cả vote cho một target (place hoặc review)
export const getVotesByTarget = async (targetId, targetType) => {
  const res = await API.get("/votes", {
    params: { target_id: targetId, target_type: targetType },
  });
  return res.data;
};

// Xóa vote theo id
export const deleteVote = async (voteId) => {
  const res = await API.delete(`/votes/${voteId}`);
  return res.data;
};
