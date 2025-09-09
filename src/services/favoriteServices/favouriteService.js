import axios from "axios";

const API_URL = "http://localhost:5000/api/favorite";

export const toggleFavorite = async (placeId) => {
  try {
    const token = localStorage.getItem("token"); // lấy token đã lưu sau khi login
    const res = await axios.post(
      `${API_URL}/${placeId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi khi gọi toggleFavorite:", err);
    throw err;
  }
};

export const getUserFavorites = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách favorites:", err);
    throw err;
  }
};
