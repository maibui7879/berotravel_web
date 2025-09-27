import API from "../api";

export const searchNearby = async (
  latitude,
  longitude,
  radius = 4,
  name,
  category,
  page = 1,
  limit = 10
) => {
  const res = await API.get("/places/search/nearby", {
    params: { latitude, longitude, radius, name, category, page, limit },
  });
  return {
    data: res.data.data,
    total: res.data.total,
    page: res.data.page,
    limit: res.data.limit,
    totalPages: res.data.totalPages,
  };
};
