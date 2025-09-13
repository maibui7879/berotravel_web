import { useState } from "react";
import { updatePlace } from "../../../services/placeServices/updatePlace";
import ImageUploader from "./ImageUploader";
import InfoForm from "./InfoForm";
import MapPicker from "./MapPicker";

export default function EditPlaceModal({ place, setPlace, setShowModal, updating, setUpdating, id }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-[95%] max-w-6xl shadow-lg relative flex flex-col mt-10 mb-10">
        <div className="flex justify-between items-center border-b px-4 py-2">
          <h2 className="text-lg font-bold">Chỉnh sửa địa điểm</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cột upload ảnh, ẩn khi mobile */}
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

          {/* Info + ảnh khi mobile */}
          <div className="flex flex-col gap-4">
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

        <div className="flex justify-end gap-3 border-t px-4 py-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={updating}
          >
            {updating ? "Đang lưu..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
