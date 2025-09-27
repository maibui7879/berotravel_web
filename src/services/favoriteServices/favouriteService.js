import API from "../api"

export const toggleFavorite = async (placeId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post(
      `/favorite/${placeId}`,
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
    const res = await API.get("/favorite", {
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
