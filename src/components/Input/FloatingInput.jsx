import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function FloatingInput({ label, type = "text", value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        type={isPassword && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      <label
        className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1"
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
}
