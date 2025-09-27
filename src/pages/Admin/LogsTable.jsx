import { FaTrashAlt } from "react-icons/fa";
import moment from "moment";

export default function LogsTable({
  logs,
  filterAction,
  setFilterAction,
  actionTags,
  searchKeyword,
  setSearchKeyword,
  sortOrder,
  setSortOrder,
  handleDeleteLog,
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          {actionTags.map((a) => (
            <option key={a} value={a}>
              {a === "all" ? "Tất cả hành động" : a}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="desc">Mới nhất trước</option>
          <option value="asc">Cũ nhất trước</option>
        </select>
      </div>

      <div className="overflow-x-auto max-h-[300px] md:max-h-[500px] overflow-y-auto rounded-lg shadow-lg">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            Không có log nào để hiển thị
          </p>
        ) : (
          <table className="min-w-full bg-white text-sm sm:text-base">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">
                  Hành động
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">
                  Mô tả
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                  Người thực hiện
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold text-gray-700">
                  Thời gian
                </th>
                <th className="px-4 sm:px-6 py-3 text-center font-semibold text-gray-700">
                  Xử lý
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={log.id}
                  className={`${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 sm:px-6 py-3 font-medium text-blue-600">
                    {log.action}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-700">
                    {log.description}
                  </td>
                  <td className="px-4 sm:px-6 py-3 hidden md:table-cell">
                    {log.userName}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600 hidden lg:table-cell">
                    {log.userEmail}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-500">
                    {moment(log.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-500 hover:text-red-700 transition-all"
                      title="Xóa log"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
