import API from "../api";

export const createPlace = async (placeData) => {
  const res = await API.post("/places", placeData);
  return res.data;
};
