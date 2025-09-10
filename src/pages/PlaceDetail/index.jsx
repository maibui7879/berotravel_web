import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaceById } from "../../services/placeServices/getPlace";
import { getRatingSummary } from "../../services/reviewServices/reviewServices";
import Slider from "./components/Slider";
import Thumbnail from "./components/Thumbnail";
import Info from "./components/Info";
import RatingCard from "./components/RatingCard";
import FavoriteCard from "./components/FavoriteCard";
import EditImageModal from "./components/EditImageModal";
import CommentSection from "./components/CommentSection";
import { useHeader } from "../../contexts/headerContext";

export default function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ratingSummary, setRatingSummary] = useState(null);
  const { setTransparent } = useHeader();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await getPlaceById(id);
        setPlace(data);
      } catch (error) {
        console.error("Error fetching place:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  useEffect(() => {
    if (place?.img_set?.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % place.img_set.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [place]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const summary = await getRatingSummary(id);
        setRatingSummary(summary);
      } catch (err) {
        console.error("Lỗi khi lấy rating:", err);
      }
    };
    fetchRating();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      console.log("[PlaceDetail][DEBUG] scrollY:", window.scrollY);
      setTransparent(window.scrollY < 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setTransparent]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!place) return <div className="p-4">Place not found</div>;

  return (
    <div className="w-full relative pb-8">
      <Slider place={place} currentSlide={currentSlide} />
      <Thumbnail place={place} setShowModal={setShowModal} />
      <div className="w-full md:w-3/4 mx-auto">
      <Info place={place} />
      <div className="flex justify-center">
        <FavoriteCard place={place} />
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <RatingCard 
          ratingSummary={ratingSummary} 
          setRatingSummary={setRatingSummary}
          placeId={id} 
        />
        
      </div>
      <div className="mt-6 px-6">
        <CommentSection placeId={id} place={place} />
      </div>
      {showModal && (
        <EditImageModal
          place={place}
          setPlace={setPlace}
          setShowModal={setShowModal}
          updating={updating}
          setUpdating={setUpdating}
          id={id}
        />
      )}
    </div>
    </div>
  );
}
