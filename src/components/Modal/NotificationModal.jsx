// src/components/Modal/NotificationModal.jsx
import { FaCheck } from "react-icons/fa";

export default function NotificationModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-2xl shadow-lg w-80 animate-fade-in">
        <div className="px-4 py-2 border-b font-semibold text-center">
          Thông báo
        </div>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mb-3 shadow">
            <FaCheck className="text-white text-2xl" />
          </div>
          <p className="text-green-600 font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );
}
