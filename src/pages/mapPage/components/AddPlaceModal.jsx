// src/pages/Place/AddPlaceModal.jsx
import { useState } from "react";
import { createPlace } from "../../../services/placeServices/createPlace";
import InfoForm from "../../../components/Modal/InfoForm";
import ImageUploader from "../../../components/Modal/ImageUploader";
import NotificationModal from "../../../components/Modal/NotificationModal";

export default function AddPlaceModal({ position, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    category: "",
    latitude: position ? position[0] : null,
    longitude: position ? position[1] : null,
    image_url: "",
    img_set: [],
  });

  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState("");
  const [errorToast, setErrorToast] = useState("");

  const handleSave = async () => {
    try {
      setUpdating(true);
      const payload = {
        ...formData,
        latitude: position ? position[0] : formData.latitude,
        longitude: position ? position[1] : formData.longitude,
      };
      const created = await createPlace(payload);
      if (onCreated) onCreated(created);

      onClose();
      setUpdating(false);
      setNotification("Thêm địa điểm thành công");
      setTimeout(() => setNotification(""), 2000);
    } catch (err) {
      console.error("Tạo địa điểm thất bại:", err);
      setErrorToast("Thêm địa điểm thất bại, vui lòng thử lại!");
      setTimeout(() => setErrorToast(""), 3000);
      setUpdating(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[9999] overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="rounded-2xl w-full max-w-5xl shadow-xl relative flex flex-col mt-12 mb-12 bg-gray-50">
          <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="hidden md:block bg-white rounded-xl shadow">
              <ImageUploader
                formData={formData}
                setFormData={setFormData}
                id={null}
                updating={updating}
                setUpdating={setUpdating}
              />
            </div>

            <div className="flex flex-col gap-4 bg-white rounded-xl shadow">
              <InfoForm
                formData={formData}
                setFormData={setFormData}
                position={position}
                setPosition={() => {}}
              />
              <div className="md:hidden">
                <ImageUploader
                  formData={formData}
                  setFormData={setFormData}
                  id={null}
                  updating={updating}
                  setUpdating={setUpdating}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center px-6 py-4 border-t">
            <button
              onClick={handleSave}
              className="px-8 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 relative"
              disabled={updating}
            >
              {updating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <NotificationModal
          message={notification}
          onClose={() => setNotification("")}
        />
      )}

      {errorToast && (
        <div className="fixed bottom-6 right-6 bg-red-500 text-white px-5 py-3 rounded-xl shadow-lg z-[10000] animate-fade-in">
          {errorToast}
        </div>
      )}
    </>
  );
}
