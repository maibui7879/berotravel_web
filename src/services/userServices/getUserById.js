import API from "../api";

export const getUserById = async (id) => {
  const token = localStorage.getItem("token");
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  const res = await API.get(`/users/${id}`);
  return res.data;
};
