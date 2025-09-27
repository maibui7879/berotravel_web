import { FaEdit } from "react-icons/fa";

export default function Thumbnail({ place, setShowModal }) {
  const imageUrl =
    place.image_url && place.image_url !== "NaN" ? place.image_url : "/placeholder.png";

  return (
    <div className="relative flex justify-center">
      <div className="absolute -top-16">
        <div className="relative border-4 rounded-lg border-white">
          <img
            src={imageUrl}
            alt={place.name || "Placeholder"}
            className="w-32 h-32 object-cover rounded-lg shadow-lg"
          />
          <button
            onClick={() => setShowModal(true)}
            className="absolute -bottom-2.5 -right-3 text-gray-700 p-2 rounded-full bg-white border-gray-200 border-4"
          >
            <FaEdit size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
