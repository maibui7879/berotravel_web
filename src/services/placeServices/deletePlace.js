import API from "../api";

export const deletePlace = async (id) => {
  const res = await API.delete(`/places/${id}`);
  return res.data;
};
