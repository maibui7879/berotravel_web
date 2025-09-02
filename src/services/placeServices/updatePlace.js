import API from "../api";

export const updatePlace = async (id, placeData) => {
  const res = await API.put(`/places/${id}`, placeData);
  return res.data;
};
