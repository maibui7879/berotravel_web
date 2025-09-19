import React, { useState } from "react";
import FloatingInput from "../../components/Input/FloatingInput";
import { updateProfile, getProfile } from "../../services/userServices/profileServices";
import { uploadImage } from "../../services/placeServices/cloudinaryServices";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";

function SuccessModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg shadow-lg w-80 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
          <FaCheck className="text-white text-xl" />
        </div>
        <h2 className="text-lg font-semibold text-green-600 mb-1">Cập nhật thành công</h2>
        <p className="text-gray-600 text-sm">Thông tin cá nhân đã được lưu.</p>
      </div>
    </div>
  );
}

export default function EditProfileModal({ profile, onClose, onUpdate }) {
  const [editForm, setEditForm] = useState({
    name: profile.name || "",
    avatar_url: profile.avatar_url || "",
    cover_url: profile.cover_url || "",
    dob: profile.dob || "",
    bio: profile.bio || "",
  });

  const [preview, setPreview] = useState({ avatar: null, cover: null });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileSelect = (file, isCover = false) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (isCover) setPreview({ ...preview, cover: { file, url } });
    else setPreview({ ...preview, avatar: { file, url } });
  };

  const handleClickUpload = (isCover) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => handleFileSelect(e.target.files[0], isCover);
    input.click();
  };

  const handleSave = async () => {
    try {
      let avatarUrl = editForm.avatar_url;
      let coverUrl = editForm.cover_url;

      if (preview.avatar) avatarUrl = await uploadImage(preview.avatar.file);
      if (preview.cover) coverUrl = await uploadImage(preview.cover.file);

      const updatedData = { ...editForm, avatar_url: avatarUrl, cover_url: coverUrl };
      await updateProfile(updatedData);
      const refreshed = await getProfile();
      onUpdate(refreshed);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    }
  };

  return (
    <>
      {/* Chỉ hiển thị modal chỉnh sửa khi không show success */}
      {!showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-[9999] p-4 ">
          <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg flex flex-col max-h-[calc(100vh-2rem)]">
            <div className="overflow-y-auto flex-1 flex flex-col rounded-lg">
              {/* Header */}
              <div className="border-b pl-4 md:px-4 py-2 font-semibold flex justify-between items-center sticky top-0 bg-white z-10">
                <span>Chỉnh sửa thông tin cá nhân</span>
                <button onClick={onClose} className="text-red-500 hover:text-red-700 font-bold text-2xl">
                  <FaTimes />
                </button>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="relative">
                  <h2 className="text-lg font-semibold col-span-full text-center mb-2">Ảnh đại diện và ảnh bìa</h2>
                  {/* Cover */}
                  <div
                    className="relative w-full h-40 md:h-48 bg-gray-200 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                    onClick={() => handleClickUpload(true)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileSelect(e.dataTransfer.files[0], true);
                    }}
                  >
                    {preview.cover ? (
                      <img src={preview.cover.url} alt="cover-preview" className="w-full h-full object-cover" />
                    ) : editForm.cover_url ? (
                      <img src={editForm.cover_url} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                      <FaCamera className="text-3xl text-gray-500" />
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className="absolute left-1/2 -bottom-12 transform -translate-x-1/2 w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden border-4 border-white shadow"
                    onClick={() => handleClickUpload(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileSelect(e.dataTransfer.files[0], false);
                    }}
                  >
                    {preview.avatar ? (
                      <img src={preview.avatar.url} alt="avatar-preview" className="w-full h-full object-cover" />
                    ) : editForm.avatar_url ? (
                      <img src={editForm.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FaCamera className="text-3xl text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Right: Form */}
                <div className="flex flex-col gap-4 mt-20 md:mt-0">
                  <h2 className="text-lg font-semibold col-span-full text-center mb-2">Thông tin cá nhân</h2>
                  <FloatingInput
                    label="Tên"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <FloatingInput
                    label="Ngày sinh"
                    type="date"
                    value={editForm.dob}
                    onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                  />
                  <FloatingInput
                    label="Bio"
                    type="text"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="border rounded-xl p-3 w-full resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t px-4 py-2 mt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-white border border-blue-500 hover:text-blue-500 w-1/4 mx-auto"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal luôn hiện khi showSuccess */}
      {showSuccess && <SuccessModal />}
    </>
  );
}
