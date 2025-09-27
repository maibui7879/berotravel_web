import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";
import FloatingInput from "../../components/Input/FloatingInput";
import AnimatedButton from "../../components/Button/AnimatedButton";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isConfirmValid, setIsConfirmValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  useEffect(() => {
    if (registerData.confirmPassword) {
      setIsConfirmValid(registerData.password === registerData.confirmPassword);
    }
  }, [registerData.password, registerData.confirmPassword]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ ...loginData, type: "login" });
      toast.success("Đăng nhập thành công!");
      await new Promise((r) => setTimeout(r, 1000));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isConfirmValid) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });
      toast.success("Đăng ký thành công! Hãy đăng nhập.");
      setIsLogin(true);
      setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row overflow-hidden bg-white rounded-2xl shadow-lg">
        <div
          className={`w-full md:w-1/2 p-10 flex flex-col justify-center items-center transition-all duration-700 ${
            isLogin ? "block" : "hidden md:flex"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-600">Đăng nhập</h2>
          {error && isLogin && <p className="text-red-500 mb-4">{error}</p>}
          <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
            <FloatingInput
              label="Email"
              type="text"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <FloatingInput
              label="Mật khẩu"
              type="text"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <AnimatedButton
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white hover:bg-blue-600 w-full flex justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Đăng nhập"
              )}
            </AnimatedButton>
          </form>
          <div className="mt-6 md:hidden text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-blue-500 font-semibold hover:underline"
              >
                Đăng ký
              </button>
            </p>
          </div>
        </div>

        <div
          className={`w-full md:w-1/2 p-10 flex flex-col justify-center items-center transition-all duration-700 ${
            isLogin ? "hidden md:flex" : "block"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-600">Đăng ký</h2>
          {error && !isLogin && <p className="text-red-500 mb-4">{error}</p>}
          <form className="w-full flex flex-col gap-5" onSubmit={handleRegister}>
            <FloatingInput
              label="Họ và tên"
              type="text"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            />
            <FloatingInput
              label="Email"
              type="text"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <FloatingInput
              label="Mật khẩu"
              type="text"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <FloatingInput
              label="Xác nhận mật khẩu"
              type="text"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({ ...registerData, confirmPassword: e.target.value })
              }
              invalid={registerData.confirmPassword && !isConfirmValid}
            />
            <AnimatedButton
              type="submit"
              disabled={!isConfirmValid}
              className={`w-full text-white ${
                isConfirmValid
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Đăng ký
            </AnimatedButton>
          </form>
          <div className="mt-6 md:hidden text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-blue-500 font-semibold hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>

        <div className="hidden md:flex absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl overflow-hidden">
          <div
            className={`h-full w-1/2 bg-blue-500 text-white flex flex-col justify-center items-center transition-transform duration-700 pointer-events-auto ${
              isLogin ? "translate-x-full" : "-translate-x-0"
            }`}
          >
            <div className="text-center p-8">
              <h3 className="text-2xl font-bold mb-4">
                {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
              </h3>
              <AnimatedButton
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="border border-white rounded-xl px-6 py-2 text-white hover:bg-white hover:text-blue-500 transition"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
