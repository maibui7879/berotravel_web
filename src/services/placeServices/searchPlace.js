import API from "../api";

export const searchByName = async (name, category, latitude, longitude, radius = 4) => {
  const res = await API.get("/places/search/by-name", {
    params: { name, category, latitude, longitude, radius },
  });
  return res.data;
};

export const searchByCategory = async (category, name, latitude, longitude, radius = 4) => {
  const res = await API.get("/places/search/by-category", {
    params: { category, name, latitude, longitude, radius },
  });
  return res.data;
};

export const searchNearby = async (latitude, longitude, radius = 4, name, category) => {
  const res = await API.get("/places/search/nearby", {
    params: { latitude, longitude, radius, name, category },
  });
  return res.data;
};
