import { FaPlus } from "react-icons/fa";
import { uploadImage } from "../../../services/placeServices/cloudinaryServices";
import { updatePlaceImages } from "../../../services/placeServices/updatePlace";

export default function ImageUploader({ formData, setFormData, setPlace, id, updating, setUpdating }) {
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
          newData = { ...formData, image_url: url };
        } else {
          const imgSet = [...formData.img_set];
          imgSet[index] = url;
          newData = { ...formData, img_set: imgSet };
        }
        setFormData(newData);
        const updated = await updatePlaceImages(id, {
          image_url: newData.image_url,
          img_set: newData.img_set,
        });
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
    <div className="flex flex-col border rounded">
      <h3 className="text-base font-semibold p-2 border-b">Upload ảnh</h3>
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        <div
          className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center relative cursor-pointer"
          onClick={() => handleUpload(0, true)}
        >
          {formData.image_url && formData.image_url !== "NaN" ? (
            <img
              src={formData.image_url}
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
              {formData.img_set && formData.img_set[i] ? (
                <img
                  src={formData.img_set[i]}
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
    </div>
  );
}
