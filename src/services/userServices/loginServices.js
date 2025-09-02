import API from "../api";

export const loginUser = async (userData) => {
  const res = await API.post("/users/login", userData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  }
  return res.data;
};
