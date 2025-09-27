import moment from "moment";

export default function LogsTerminal({
  logs,
  actionTags,
  filterAction,
  setFilterAction,
  searchKeyword,
  setSearchKeyword,
  sortOrder,
  setSortOrder,
  terminalRef,
}) {
  return (
    <div className="bg-black rounded-lg shadow-inner flex flex-col h-[500px]">
      <div className="sticky top-0 z-10 bg-black border-b border-gray-700 p-2 flex flex-wrap gap-2 items-center">
        {actionTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterAction(tag)}
            className={`px-3 py-1 rounded text-xs sm:text-sm font-mono transition ${
              filterAction === tag
                ? "bg-green-600 text-black hover:text-black"
                : "border border-green-500 text-green-400 hover:bg-green-800 hover:text-white"
            }`}
          >
            {tag}
          </button>
        ))}
        <input
          type="text"
          placeholder="Tìm user..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="bg-black text-green-400 border border-green-500 rounded px-2 py-1 text-xs sm:text-sm font-mono flex-1 min-w-[150px] placeholder-green-700"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-black text-green-400 border border-green-500 rounded px-2 py-1 text-xs sm:text-sm font-mono"
        >
          <option value="desc">Mới nhất trước</option>
          <option value="asc">Cũ nhất trước</option>
        </select>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-scroll text-green-400 font-mono text-xs sm:text-sm md:text-base p-3"
      >
        {logs.length === 0 ? (
          <p>Không có log nào để hiển thị</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="mb-3 p-2 border-b border-gray-700 rounded"
            >
              <div className="text-yellow-400">
                [{moment(log.createdAt).format("YYYY-MM-DD HH:mm:ss")}]{" "}
                <span className="text-blue-400 font-semibold">{log.action}</span>
              </div>
              <div>
                User: <span className="text-white">{log.userName}</span> (
                <span className="text-gray-400">{log.userEmail}</span>) | Role:{" "}
                <span className="text-pink-400">{log.userRole}</span>
              </div>
              <div>
                Desc: <span className="text-green-300">{log.description}</span>
              </div>
              <div className="text-gray-400">
                Target: {log.targetType} → {log.target}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
