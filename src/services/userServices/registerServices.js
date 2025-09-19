import API from "../api";

export const registerUser = async ({ name, email, password }) => {
  try {
    const res = await API.post("/users/register", { name, email, password });
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Đăng ký thất bại");
    }
    throw new Error("Không thể kết nối đến server");
  }
};
