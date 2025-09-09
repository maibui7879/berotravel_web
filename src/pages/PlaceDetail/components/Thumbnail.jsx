import { FaEdit } from "react-icons/fa";

export default function Thumbnail({ place, setShowModal }) {
  return (
    <div className="relative flex justify-center">
      <div className="absolute -top-16">
        <div className="relative">
          {place.image_url && place.image_url !== "NaN" ? (
            <img
              src={place.image_url}
              alt={place.name}
              className="w-32 h-32 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-lg shadow-lg"></div>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-1 right-1 text-gray-700 p-2 rounded-full shadow"
          >
            <FaEdit size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
