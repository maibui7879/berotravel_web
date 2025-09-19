import API from "../api";

// Tổng số places
export const getPlacesCount = async () => {
  try {
    const res = await API.get("/places/count");
    return res.data.totalPlaces; // { totalPlaces: 123 }
  } catch (err) {
    console.error("Lỗi khi lấy tổng số places:", err);
    throw err;
  }
};

// Tổng số users
export const getUsersCount = async () => {
  try {
    const res = await API.get("/users/count");
    return res.data.totalUsers; // { totalUsers: 42 }
  } catch (err) {
    console.error("Lỗi khi lấy tổng số users:", err);
    throw err;
  }
};

// Tổng số reviews
export const getReviewsCount = async () => {
  try {
    const res = await API.get("/reviews/count");
    return res.data.totalReviews; // { totalReviews: 42 }
  } catch (err) {
    console.error("Lỗi khi lấy tổng số reviews:", err);
    throw err;
  }
};

// Thống kê bản thân
export const getMyStats = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token không tồn tại, cần đăng nhập");
  try {
    const res = await API.get("/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy thống kê bản thân:", err);
    throw err;
  }
};

// Thống kê user khác theo userId
export const getUserStatsById = async (userId) => {
  if (!userId) throw new Error("userId không được để trống");
  try {
    const res = await API.get(`/user-stats/${userId}`);
    return res.data;
  } catch (err) {
    console.error(`Lỗi khi lấy thống kê user ${userId}:`, err);
    throw err;
  }
};
