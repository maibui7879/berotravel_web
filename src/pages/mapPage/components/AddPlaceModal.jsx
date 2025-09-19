import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { createPlace } from "../../../services/placeServices/createPlace";
import InfoForm from "../../PlaceDetail/components/InfoForm";
import ImageUploader from "../../PlaceDetail/components/ImageUploader";

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
  const [showNotification, setShowNotification] = useState(false);
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
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 2000);
    } catch (err) {
      console.error("Tạo địa điểm thất bại:", err);
      setErrorToast("Thêm địa điểm thất bại, vui lòng thử lại!");
      setTimeout(() => setErrorToast(""), 3000);
      setUpdating(false);
    }
  };

  // Đóng modal khi bấm ra ngoài
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-[9999] overflow-y-auto"
        onClick={handleBackdropClick}
      >
        <div className="rounded-lg w-full max-w-5xl shadow-lg relative flex flex-col mt-10 mb-10">
          <div className="px-4 grid grid-cols-1 md:grid-cols-2 md:w-3/4 md:mx-auto gap-4">
            <div className="hidden md:block bg-white rounded-lg shadow-md">
              <ImageUploader
                formData={formData}
                setFormData={setFormData}
                id={null}
                updating={updating}
                setUpdating={setUpdating}
              />
            </div>

            <div className="flex flex-col gap-4 bg-white rounded-lg shadow-md">
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

          {/* Chỉ còn nút Xác nhận, căn giữa */}
          <div className="flex justify-center px-4 py-2 max-w-3xl w-full mx-auto">
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-white hover:text-blue-700 border-blue-700 disabled:opacity-50 text-center relative"
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

      {/* Modal thông báo thành công */}
      {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-lg shadow-lg w-80">
            <div className="px-4 py-2 border-b font-semibold">Thông báo</div>
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-3">
                <FaCheck className="text-white text-xl" />
              </div>
              <p className="text-green-500 font-medium">
                Thêm địa điểm thành công
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast lỗi */}
      {errorToast && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-[10000]">
          {errorToast}
        </div>
      )}
    </>
  );
}
