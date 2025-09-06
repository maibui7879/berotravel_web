import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaceById } from "../services/placeServices/getPlace";

export default function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (!place) return <div className="p-4">Place not found</div>;

  return (
    <div className="w-screen relative">
      {/* Ảnh nền chính */}
      <div className="relative w-screen h-80">
        {place.image_url && place.image_url !== "NaN" ? (
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
        {/* Overlay đen */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Ảnh thumbnail nổi bên dưới */}
      <div className="relative flex justify-center">
        <div className="absolute -top-16">
          {place.image_url && place.image_url !== "NaN" ? (
            <img
              src={place.image_url}
              alt={place.name}
              className="w-32 h-32 object-cover rounded-lg shadow-lg border-4 border-white"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-lg shadow-lg border-4 border-white"></div>
          )}
        </div>
      </div>

      {/* Nội dung */}
      <div className="mt-20 px-6 text-center space-y-2">
        <h1 className="text-2xl font-bold">{place.name}</h1>
        <p className="text-gray-600">{place.address}</p>
        <p className="italic text-gray-500">{place.description}</p>
      </div>
    </div>
  );
}
