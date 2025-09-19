import API from "../api";

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  const res = await API.get("/users/profile");
  return res.data;
};

export const updateProfile = async ({ name, avatar_url, cover_url, dob, bio, password }) => {
  const token = localStorage.getItem("token");
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  const res = await API.put("/users/profile", {
    name,
    avatar_url,
    cover_url,
    dob,
    bio,
    password,
  });
  return res.data;
};
