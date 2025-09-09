import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaStar } from "react-icons/fa";

export default function ReviewCard({ review, currentUserId, onDelete, onEdit, onSave, onCancel }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(review.comment);

  const handleEditClick = () => {
    setEditing(true);
    onEdit && onEdit(review);
  };

  const handleSaveClick = () => {
    onSave && onSave(review._id, editText);
    setEditing(false);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setEditText(review.comment);
    onCancel && onCancel();
  };

  return (
    <div className="bg-white mt-16 rounded-2xl p-6 pt-16 relative shadow-lg flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-3 hover:shadow-2xl min-h-[24rem]">
      <img
        src={review.user_id?.avatar_url || "/src/assets/avatar-placeholder.png"}
        alt="avatar"
        className="w-24 h-24 rounded-full object-cover absolute -top-12 border-4 border-white shadow-md"
      />
      <span className="font-bold text-lg md:text-xl text-gray-800 mt-2">{review.user_id?.name}</span>

      <div className="flex items-center gap-2 mt-2">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            size={20}
            className={`${review.rating > i ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="text-base text-gray-500 font-medium ml-1">{review.rating}/5</span>
      </div>

      {editing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 resize-none"
          rows={3}
        />
      ) : (
        <p className="text-gray-700 mt-4 text-base md:text-lg">{review.comment}</p>
      )}

      {currentUserId === review.user_id?._id && (
        <div className="flex gap-4 mt-4">
          {editing ? (
            <>
              <FaCheck className="text-green-500 cursor-pointer text-xl" onClick={handleSaveClick} />
              <FaTimes className="text-gray-500 cursor-pointer text-xl" onClick={handleCancelClick} />
            </>
          ) : (
            <>
              <FaEdit className="text-blue-500 cursor-pointer text-xl" onClick={handleEditClick} />
              <FaTrash
                className="text-gray-400 hover:text-red-500 cursor-pointer text-xl"
                onClick={() => onDelete && onDelete(review._id)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
