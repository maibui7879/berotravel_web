import React from "react";

export default function AnimatedButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-3 rounded-xl transition-all duration-150 
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
        ${className}`}
    >
      {children}
    </button>
  );
}
