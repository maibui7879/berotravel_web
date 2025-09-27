export default function FloatingTextarea({ label, value, onChange }) {
  return (
    <div className="relative w-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder=" "
        rows={3}
        className="peer w-full px-4 pt-5 pb-2 border bg-white border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      <label
        className="absolute left-4 top-1 text-gray-500 text-xs transition-all duration-200
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
        peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1"
      >
        {label}
      </label>
    </div>
  );
}