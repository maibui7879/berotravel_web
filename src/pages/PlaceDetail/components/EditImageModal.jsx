import { FaPlus } from "react-icons/fa";
import { updatePlaceImages } from "../../../services/placeServices/updatePlace";
import { uploadImage } from "../../../services/placeServices/cloudinaryServices";
export default function EditImageModal({ place, setPlace, setShowModal, updating, setUpdating, id }) {
  const handleUpload = async (index, isMain) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        setUpdating(true);
        const url = await uploadImage(file);
        let newData;
        if (isMain) {
          newData = { image_url: url, img_set: place.img_set || [] };
        } else {
          const imgSet = [...(place.img_set || [])];
          imgSet[index] = url;
          newData = { image_url: place.image_url, img_set: imgSet };
        }
        const updated = await updatePlaceImages(id, newData);
        setPlace(updated);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUpdating(false);
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] max-w-lg shadow-lg relative flex flex-col">
        <div className="flex justify-between items-center border-b px-4 py-2">
          <h2 className="text-lg font-bold">Chỉnh sửa ảnh</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div
            className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center relative cursor-pointer"
            onClick={() => handleUpload(0, true)}
          >
            {place.image_url && place.image_url !== "NaN" ? (
              <img
                src={place.image_url}
                alt="main"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <FaPlus className="text-3xl text-gray-500" />
            )}
            {updating && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white">
                Uploading...
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center relative cursor-pointer"
                onClick={() => handleUpload(i, false)}
              >
                {place.img_set && place.img_set[i] ? (
                  <img
                    src={place.img_set[i]}
                    alt={`sub-${i}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FaPlus className="text-2xl text-gray-500" />
                )}
                {updating && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm">
                    Uploading...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t px-4 py-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            onClick={async () => {
              try {
                setUpdating(true);
                const newData = {
                  image_url: place.image_url,
                  img_set: place.img_set || [],
                };
                const updated = await updatePlaceImages(id, newData);
                setPlace(updated);
                setShowModal(false);
              } catch (err) {
                console.error("Cập nhật ảnh thất bại:", err);
              } finally {
                setUpdating(false);
              }
            }}
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
