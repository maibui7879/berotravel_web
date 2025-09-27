// ImageUploader.jsx
import { FaPlus } from "react-icons/fa";
import { uploadImage } from "../../services/placeServices/cloudinaryServices";
import { updatePlaceImages } from "../../services/placeServices/updatePlace";
import { useState } from "react";

export default function ImageUploader({
  formData,
  setFormData,
  setPlace,
  id,
  updating,
  setUpdating,
}) {
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleUpload = async (file, index, isMain) => {
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
      if (id) {
        const updated = await updatePlaceImages(id, {
          image_url: newData.image_url,
          img_set: newData.img_set,
        });
        setPlace(updated);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleClickUpload = (index, isMain) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => handleUpload(e.target.files[0], index, isMain);
    input.click();
  };

  const handleDrop = (e, index, isMain) => {
    e.preventDefault();
    setDragOverIndex(null);
    const file = e.dataTransfer.files[0];
    handleUpload(file, index, isMain);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  return (
    <div className="flex flex-col rounded-2xl shadow-md border bg-white">
      <h3 className="text-base font-semibold p-3 border-b bg-gray-50 rounded-t-2xl">
        Upload ảnh
      </h3>
      <div className="flex-1 p-3 space-y-5">
        <div
          className={`w-full h-44 rounded-xl flex items-center justify-center relative cursor-pointer border-2 ${
            dragOverIndex === -1 ? "border-blue-500" : "border-dashed border-gray-300"
          } bg-gray-50 hover:bg-gray-100 transition`}
          onClick={() => handleClickUpload(0, true)}
          onDragOver={(e) => handleDragOver(e, -1)}
          onDrop={(e) => handleDrop(e, 0, true)}
        >
          {formData.image_url && formData.image_url !== "NaN" ? (
            <img
              src={formData.image_url}
              alt="main"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <FaPlus className="text-3xl text-gray-400" />
          )}
          {updating && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white rounded-xl">
              Uploading...
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-full h-24 rounded-xl flex items-center justify-center relative cursor-pointer border-2 ${
                dragOverIndex === i ? "border-blue-500" : "border-dashed border-gray-300"
              } bg-gray-50 hover:bg-gray-100 transition`}
              onClick={() => handleClickUpload(i, false)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i, false)}
            >
              {formData.img_set && formData.img_set[i] ? (
                <img
                  src={formData.img_set[i]}
                  alt={`sub-${i}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <FaPlus className="text-2xl text-gray-400" />
              )}
              {updating && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm rounded-xl">
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
