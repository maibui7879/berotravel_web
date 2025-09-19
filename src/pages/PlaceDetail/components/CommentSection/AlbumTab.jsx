import { useState } from "react";

export default function AlbumTab({ place }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(null);

  const images = [
    place?.image_url,
    ...(place?.img_set?.filter((img) => img) || []),
  ];

  const openModal = (img) => {
    setCurrentImg(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentImg(null);
    setModalOpen(false);
  };

  if (!images.length) return <p>Chưa có ảnh nào trong album.</p>;

  return (
    <div>
      {/* Grid ảnh kiểu Facebook */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 md:bg-gray-200 md:p-4 rounded-lg">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-lg cursor-pointer ${
              idx === 0 ? "sm:col-span-2 sm:row-span-2" : ""
            }`}
            onClick={() => openModal(img)}
          >
            <img
              src={img}
              alt={`place-img-${idx}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>

      {/* Modal xem ảnh */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={closeModal}
        >
          <img
            src={currentImg}
            alt="full-img"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
