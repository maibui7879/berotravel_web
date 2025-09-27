// EditPlaceModal.jsx
import { useState } from "react";
import { updatePlace } from "../../../services/placeServices/updatePlace";
import ImageUploader from "../../../components/Modal/ImageUploader";
import InfoForm from "../../../components/Modal/InfoForm";
import MapPicker from "../../../components/Modal/MapPicker";

export default function EditPlaceModal({
  place,
  setPlace,
  setShowModal,
  updating,
  setUpdating,
  id,
}) {
  const [formData, setFormData] = useState({
    name: place.name || "",
    address: place.address || "",
    description: place.description || "",
    category: place.category || "",
    latitude: place.latitude || null,
    longitude: place.longitude || null,
    image_url: place.image_url || "",
    img_set: place.img_set || [],
  });

  const [position, setPosition] = useState(
    place.latitude && place.longitude ? [place.latitude, place.longitude] : null
  );

  const handleSave = async () => {
    try {
      setUpdating(true);
      const payload = {
        ...formData,
        latitude: position ? position[0] : formData.latitude,
        longitude: position ? position[1] : formData.longitude,
      };
      const updated = await updatePlace(id, payload);
      setPlace(updated);
      setShowModal(false);
    } catch (err) {
      console.error("Cập nhật place thất bại:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-[501] overflow-y-auto">
      <div className="rounded-2xl w-[95%] max-w-6xl shadow-2xl relative flex flex-col mt-10 mb-10 bg-white">
        <div className="flex justify-between items-center px-6 border-b rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-500">
          <h2 className="text-lg font-bold text-white">Chỉnh sửa địa điểm</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
          <div className="hidden md:block">
            <ImageUploader
              formData={formData}
              setFormData={setFormData}
              setPlace={setPlace}
              id={id}
              updating={updating}
              setUpdating={setUpdating}
            />
          </div>

          <div className="flex flex-col gap-5">
            <InfoForm
              formData={formData}
              setFormData={setFormData}
              position={position}
              setPosition={setPosition}
            />
            <div className="md:hidden">
              <ImageUploader
                formData={formData}
                setFormData={setFormData}
                setPlace={setPlace}
                id={id}
                updating={updating}
                setUpdating={setUpdating}
              />
            </div>
          </div>

          <MapPicker position={position} setPosition={setPosition} />
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 hover:text-red-500 transition"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 transition disabled:opacity-50"
            disabled={updating}
          >
            {updating ? "Đang lưu..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
