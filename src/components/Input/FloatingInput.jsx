import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function FloatingInput({
  label,
  type,
  value,
  onChange,
  required,
  invalid,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        type={isPassword && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className={`peer border rounded-xl px-3 pt-5 pb-2 w-full focus:outline-none focus:ring-2 ${
          invalid
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-400"
        }`}
      />
      <label
        className={`absolute left-3 top-2 text-gray-500 text-base transition-all 
          peer-placeholder-shown:top-1/4 peer-placeholder-shown:-translate-y-1/4 
          peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
          peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500
          peer-valid:top-1 peer-valid:text-sm peer-valid:text-blue-500`}
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
