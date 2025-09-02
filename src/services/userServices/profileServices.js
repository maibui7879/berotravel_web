import API from "../api";

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  const res = await API.get("/users/profile");
  return res.data;
};
