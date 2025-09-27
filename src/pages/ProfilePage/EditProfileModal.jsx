import React, { useState } from "react";
import FloatingInput from "../../components/Input/FloatingInput";
import FloatingTextarea from "../../components/Input/FloatingTextArea";
import { updateProfile, getProfile } from "../../services/userServices/profileServices";
import { uploadImage } from "../../services/placeServices/cloudinaryServices";
import { FaPlus, FaCheck } from "react-icons/fa";

function SuccessModal({ message }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
          <FaCheck className="text-white text-xl" />
        </div>
        <h2 className="text-lg font-semibold text-green-600 mb-1">Thành công</h2>
        <p className="text-gray-600 text-sm">{message}</p>
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

  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(null);

  const handleUpload = async (file, isCover) => {
    if (!file) return;
    try {
      setUpdating(true);
      const url = await uploadImage(file);
      if (isCover) {
        setEditForm({ ...editForm, cover_url: url });
      } else {
        setEditForm({ ...editForm, avatar_url: url });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleClickUpload = (isCover) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => handleUpload(e.target.files[0], isCover);
    input.click();
  };

  const handleDrop = (e, isCover) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    handleUpload(file, isCover);
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      await updateProfile(editForm);
      const refreshed = await getProfile();
      onUpdate(refreshed);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {!showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-[9999] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 border-b rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-500">
              <h2 className="text-lg font-bold text-white">Chỉnh sửa thông tin cá nhân</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Left: Cover + Avatar */}
              <div className="relative">
                <h2 className="text-lg font-semibold text-center mb-2">
                  Ảnh đại diện và ảnh bìa
                </h2>

                {/* Cover */}
                <div
                  className={`relative w-full h-40 md:h-48 rounded-xl flex items-center justify-center cursor-pointer border-2 ${
                    dragOver === "cover" ? "border-blue-500" : "border-dashed border-gray-300"
                  } bg-gray-50 hover:bg-gray-100 transition overflow-hidden`}
                  onClick={() => handleClickUpload(true)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver("cover");
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(e, true)}
                >
                  {editForm.cover_url ? (
                    <img src={editForm.cover_url} alt="cover" className="w-full h-full object-cover" />
                  ) : (
                    <FaPlus className="text-3xl text-gray-400" />
                  )}
                  {updating && dragOver === "cover" && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white rounded-xl">
                      Uploading...
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className={`absolute left-1/2 -bottom-12 transform -translate-x-1/2 w-32 h-32 rounded-full flex items-center justify-center cursor-pointer border-4 border-white shadow bg-gray-50 overflow-hidden border-2 ${
                    dragOver === "avatar" ? "border-blue-500" : "border-dashed border-gray-300"
                  }`}
                  onClick={() => handleClickUpload(false)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver("avatar");
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(e, false)}
                >
                  {editForm.avatar_url ? (
                    <img src={editForm.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FaPlus className="text-2xl text-gray-400" />
                  )}
                  {updating && dragOver === "avatar" && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white rounded-full">
                      Uploading...
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Form */}
              <div className="flex flex-col gap-4 mt-20 md:mt-0">
                <h2 className="text-lg font-semibold text-center mb-2">Thông tin cá nhân</h2>
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
                <FloatingTextarea
                  label="Bio"
                  type="text"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="border rounded-xl p-3 w-full resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 hover:text-red-500 transition"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-white hover:text-blue-600 border border-blue-600 transition disabled:opacity-50"
              >
                {updating ? "Đang lưu..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && <SuccessModal message="Thông tin cá nhân đã được cập nhật." />}
    </>
  );
}
