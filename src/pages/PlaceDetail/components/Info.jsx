import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Info({ place }) {
  // Helper check
  const valid = (value) => value && value !== "NaN" && value !== "";

  const name = valid(place.name) ? place.name : <i>chưa cập nhật</i>;
  const address = valid(place.address) ? place.address : <i>chưa cập nhật</i>;
  const description = valid(place.description) ? place.description : <i>chưa cập nhật</i>;
  const updatedBy = valid(place.updated_by) ? place.updated_by : <i>chưa cập nhật</i>;
  const updatedAt = valid(place.updatedAt) && !isNaN(new Date(place.updatedAt).getTime())
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(place.updatedAt))
    : null;

  return (
    <div className="mt-16 px-6 text-center max-w-3xl mx-auto space-y-4 p-6 rounded-xl">
      {/* Tên */}
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
        {name}
      </h1>

      {/* Địa chỉ */}
      <p className="flex items-center justify-center text-gray-600 gap-2">
        <FaMapMarkerAlt className={`text-red-500 ${!valid(place.address) ? "opacity-50" : ""}`} />
        {address}
      </p>

      {/* Mô tả */}
      <p className={`text-gray-500 italic px-4 md:px-0 ${!valid(place.description) ? "opacity-50" : ""}`}>
        {description}
      </p>

      {/* Cập nhật */}
      <p className={`flex items-center justify-center text-xs text-gray-400 gap-1 ${!updatedAt ? "opacity-50" : ""}`}>
        <FaClock className="text-gray-400" />
        {updatedAt ? `Cập nhật lần cuối bởi ${updatedBy} vào ${updatedAt}` : <i>chưa cập nhật</i>}
      </p>
    </div>
  );
}
