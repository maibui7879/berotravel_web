import placeholder from "../../../assets/placeholder.png"

export default function Slider({ place, currentSlide }) {
  const slides = place.img_set && place.img_set.length > 0 ? place.img_set : [placeholder];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <img
        src={slides[currentSlide % slides.length]}
        alt={`slide-${currentSlide}`}
        className="w-full h-full object-cover transition-all duration-700"
      />
      <div className="absolute inset-0 bg-black bg-opacity-25"></div>
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === currentSlide % slides.length ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
