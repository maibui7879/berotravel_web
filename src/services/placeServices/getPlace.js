import API from "../api";

export const getAllPlaces = async () => {
  const res = await API.get("/places");
  return res.data;
};

export const getPlaceById = async (id) => {
  const res = await API.get(`/places/${id}`);
  return res.data;
};
