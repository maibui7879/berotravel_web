import API from "../api";

export const registerUser = async (userData) => {
  const res = await API.post("/users/register", userData);
  return res.data;
};
