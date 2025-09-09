import API from "../api";

export const updatePlace = async (id, placeData) => {
  const allowedFields = ["name", "address", "latitude", "longitude", "description", "category"];
  const hasValidField = allowedFields.some((field) => field in placeData);

  if (!hasValidField) {
    throw new Error("Body phải có ít nhất 1 trong các field: name, address, latitude + longitude, description, category");
  }

  if ((placeData.latitude && !placeData.longitude) || (!placeData.latitude && placeData.longitude)) {
    throw new Error("latitude và longitude phải đi cùng nhau");
  }

  const res = await API.put(`/places/${id}`, placeData);
  return res.data;
};

export const updatePlaceImages = async (id, imageData) => {
  const res = await API.put(`/places/images/${id}`, imageData);
  return res.data;
};
