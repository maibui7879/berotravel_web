// src/services/reviewService.js
import API from "../api";

export const getReviews = async (placeId) => {
  const res = await API.get(`/reviews/${placeId}`);
  return res.data;
};

export const createReview = async (placeId, reviewData) => {
  const res = await API.post(`/reviews/${placeId}`, reviewData);
  return res.data;
};

export const getRatingSummary = async (placeId) => {
  const res = await API.get(`/reviews/${placeId}/rating`);
  return res.data;
};

export const updateReview = async (id, reviewData) => {
  const res = await API.put(`/reviews/${id}`, reviewData);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await API.delete(`/reviews/${id}`);
  return res.data;
};
