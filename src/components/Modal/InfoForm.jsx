// InfoForm.jsx
import React from "react";
import FloatingInput from "../Input/FloatingInput";
import FloatingTextarea from "../Input/FloatingTextArea";

export default function InfoForm({ formData, setFormData }) {
  return (
    <div className="flex flex-col rounded-2xl shadow-md border bg-white">
      <h3 className="text-base font-semibold p-3 border-b bg-gray-50 rounded-t-2xl">
        Thông tin
      </h3>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <FloatingInput
          label="Tên địa điểm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <FloatingInput
          label="Địa chỉ"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <div className="relative w-full">
          <select
            className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Chọn hạng mục</option>
            <option value="restaurant">Nhà hàng</option>
            <option value="cafe">Quán cafe</option>
            <option value="school">Trường học</option>
            <option value="fast_food">Đồ ăn nhanh</option>
            <option value="supermarket">Siêu thị</option>
            <option value="university">Đại học</option>
            <option value="attraction">Điểm tham quan</option>
            <option value="bar">Quán bar</option>
            <option value="convenience">Cửa hàng tiện lợi</option>
            <option value="marketplace">Chợ</option>
            <option value="kindergarten">Mẫu giáo</option>
            <option value="language_school">Trung tâm ngoại ngữ</option>
            <option value="playground">Sân chơi</option>
            <option value="internet_cafe">Internet cafe</option>
            <option value="driving_school">Trường dạy lái xe</option>
            <option value="park">Công viên</option>
            <option value="music_school">Nhạc viện</option>
            <option value="prep_school">Trường dự bị</option>
            <option value="fountain">Đài phun nước</option>
            <option value="college">Cao đẳng</option>
          </select>
          <label
            className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200
            peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1"
          >
            Hạng mục
          </label>
        </div>
        <FloatingTextarea
          label="Mô tả"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
    </div>
  );
}
