import { useEffect, useState, useRef } from "react";
import {
  getAllLogs,
  deleteLogById,
  deleteAllLogs,
} from "../../services/adminServices/adminServices";
import { getPlaceById } from "../../services/placeServices/getPlace";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import LogsTable from "./LogsTable";
import LogsTerminal from "./LogsTerminal";

export default function Admin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterAction, setFilterAction] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const terminalRef = useRef(null);

  const actionTags = ["all", "login", "create", "update", "delete"];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAllLogs();
      const updatedLogs = await Promise.all(
        data.map(async (log) => {
          let description = log.description;
          const regex = /place ([0-9a-f]{24})/i;
          const match = description?.match(regex);
          if (match) {
            try {
              const place = await getPlaceById(match[1]);
              if (place?.name) {
                description = description.replace(match[1], place.name);
              }
            } catch {}
          }
          return {
            id: log._id || log.id,
            action: log.action,
            description,
            userName: log.userName || log.user?.name || "System",
            userEmail: log.userEmail || log.user?.email || "-",
            userRole: log.userRole || log.user?.role || "system",
            targetType: log.targetType,
            target: log.target,
            createdAt: log.createdAt,
          };
        })
      );
      setLogs(updatedLogs);
    } catch (err) {
      toast.error(err?.message || "Lấy logs thất bại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (viewMode === "terminal" && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, viewMode]);

  const handleDeleteLog = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa log này?")) return;
    try {
      await deleteLogById(id);
      setLogs((prev) => prev.filter((log) => log.id !== id));
      toast.success("Xóa log thành công!");
    } catch (err) {
      toast.error(err?.message || "Xóa log thất bại!");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa tất cả logs?")) return;
    try {
      await deleteAllLogs();
      setLogs([]);
      toast.success("Đã xóa tất cả logs!");
    } catch (err) {
      toast.error(err?.message || "Xóa tất cả logs thất bại!");
    }
  };

  const filteredLogs = logs
    .filter((log) => {
      if (filterAction !== "all" && log.action !== filterAction) return false;
      if (
        searchKeyword &&
        !(
          log.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          log.userEmail.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      else return new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Logs hệ thống
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative bg-gray-200 rounded-full flex w-full sm:w-52 h-10">
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-blue-600 transition-all ${
                viewMode === "terminal" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            <button
              onClick={() => setViewMode("table")}
              className={`flex-1 z-10 text-sm sm:text-base text-center font-medium transition-all ${
                viewMode === "table" ? "text-white" : "text-gray-700"
              }`}
            >
              Bảng
            </button>
            <button
              onClick={() => setViewMode("terminal")}
              className={`flex-1 z-10 text-sm sm:text-base text-center font-medium transition-all ${
                viewMode === "terminal" ? "text-white" : "text-gray-700"
              }`}
            >
              Terminal
            </button>
          </div>
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow transition-all text-sm sm:text-base"
          >
            <FaTrashAlt className="inline mr-2" /> Xóa tất cả
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {!loading && viewMode === "table" && (
        <LogsTable
          logs={filteredLogs}
          filterAction={filterAction}
          setFilterAction={setFilterAction}
          actionTags={actionTags}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          handleDeleteLog={handleDeleteLog}
        />
      )}

      {!loading && viewMode === "terminal" && (
        <LogsTerminal
          logs={filteredLogs}
          actionTags={actionTags}
          filterAction={filterAction}
          setFilterAction={setFilterAction}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          terminalRef={terminalRef}
        />
      )}
    </div>
  );
}
