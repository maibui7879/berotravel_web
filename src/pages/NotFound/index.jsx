import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-900 text-center p-4">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <p className="text-xl text-gray-100 mb-6">Trang bạn tìm không tồn tại.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-white text-blue-500 transition"
      >
        Quay về trang chủ
      </button>
    </div>
  );
}
