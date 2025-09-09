import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext, { useAuth } from "../contexts/authContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData);
      navigate("/"); // chuyển về trang chủ
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(registerData);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      setIsLogin(true);
      setRegisterData({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="relative w-full h-full flex overflow-hidden">
        {/* Login form */}
        <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12 transition-transform duration-700">
          <h2 className="text-3xl font-bold mb-6">Đăng nhập</h2>
          {error && isLogin && <p className="text-red-500 mb-4">{error}</p>}
          <form className="w-3/4 flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition"
            >
              Đăng nhập
            </button>
          </form>
        </div>

        {/* Register form */}
        <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12 transition-transform duration-700">
          <h2 className="text-3xl font-bold mb-6">Đăng ký</h2>
          {error && !isLogin && <p className="text-red-500 mb-4">{error}</p>}
          <form className="w-3/4 flex flex-col gap-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Họ và tên"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition"
            >
              Đăng ký
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none">
          <div
            className={`h-full w-1/2 bg-blue-500 text-white flex flex-col justify-center items-center transition-transform duration-700 pointer-events-auto ${
              isLogin ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="text-center p-8">
              <h3 className="text-2xl font-bold mb-4">
                {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
              </h3>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="border border-white rounded-xl px-6 py-2 text-white hover:bg-white hover:text-blue-500 transition"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
