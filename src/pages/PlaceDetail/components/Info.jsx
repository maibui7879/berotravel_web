import { FaMapMarkerAlt, FaInfoCircle, FaClock } from "react-icons/fa";

export default function Info({ place }) {
  return (
    <div className="mt-16 px-6 text-center max-w-3xl mx-auto space-y-4 p-6 rounded-xl">
      {/* Tên */}
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
         {place.name}
      </h1>

      {/* Địa chỉ */}
      {place.address && (
        <p className="flex items-center justify-center text-gray-600 gap-2">
          <FaMapMarkerAlt className="text-red-500" /> {place.address}
        </p>
      )}

      {/* Mô tả */}
      {place.description && (
        <p className="text-gray-500 italic px-4 md:px-0">{place.description}</p>
      )}

      {/* Cập nhật */}
      {place.updatedAt &&
        place.updatedAt !== "NaN" &&
        !isNaN(new Date(place.updatedAt).getTime()) && (
          <p className="flex items-center justify-center text-xs text-gray-400 gap-1">
            <FaClock className="text-gray-400" />
            Cập nhật lần cuối bởi {place.updated_by} vào{" "}
            {new Intl.DateTimeFormat("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(place.updatedAt))}
          </p>
      )}
    </div>
  );
}
