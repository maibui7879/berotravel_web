import API from "../api";

// Lấy tất cả logs
export const getAllLogs = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("admin/logs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.map((log) => ({
      id: log._id,
      action: log.action,
      description: log.description || "",
      userId: log.user?._id,
      userName: log.user?.name || "System",
      userEmail: log.user?.email || "-",
      userRole: log.user?.role || "system",
      createdAt: log.createdAt,
      targetType: log.targetType || "",
      target: log.target || "",
    }));
  } catch (err) {
    console.error("Lỗi khi lấy logs:", err);
    throw err;
  }
};

// Lấy log theo ID
export const getLogById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get(`admin/logs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const log = res.data;
    return {
      id: log._id,
      action: log.action,
      description: log.description || "",
      userId: log.user?._id,
      userName: log.user?.name || "System",
      userEmail: log.user?.email || "-",
      userRole: log.user?.role || "system",
      createdAt: log.createdAt,
      targetType: log.targetType || "",
      target: log.target || "",
    };
  } catch (err) {
    console.error(`Lỗi khi lấy log ID ${id}:`, err);
    throw err;
  }
};

// Xóa log theo ID
export const deleteLogById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.delete(`admin/logs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`Lỗi khi xóa log ID ${id}:`, err);
    throw err;
  }
};

// Xóa tất cả logs
export const deleteAllLogs = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.delete("admin/logs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi xóa tất cả logs:", err);
    throw err;
  }
};
