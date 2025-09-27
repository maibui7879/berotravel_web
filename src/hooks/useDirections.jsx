import { useState, useEffect } from "react";
import axios from "axios";

export const useDirections = (userLocation) => {
  const [route, setRoute] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [directionsDestination, setDirectionsDestination] = useState(null);
  const [durationText, setDurationText] = useState("");
  const [loadingDirections, setLoadingDirections] = useState(false);

  const API_KEY = import.meta.env.VITE_ORS_API_KEY;

  const handleDirections = async (place) => {
    if (!userLocation) return;
    setLoadingDirections(true);

    const start = `${userLocation.lng},${userLocation.lat}`;
    const end = `${place.longitude},${place.latitude}`;

    try {
      const res = await axios.get("https://api.openrouteservice.org/v2/directions/driving-car", {
        params: { start, end },
        headers: { Authorization: API_KEY },
      });
      const coordinates = res.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRoute(coordinates);
      const seg = res.data.features[0].properties.segments[0];
      setSteps(seg.steps);
      setCurrentStepIndex(0);
      setDirectionsDestination(place.name);
      setDurationText(`${Math.round(seg.duration / 60)} phút`);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy đường đi thực tế");
    } finally {
      setLoadingDirections(false);
    }
  };

  const exitDirections = () => {
    setSteps([]);
    setRoute(null);
    setDirectionsDestination(null);
    setCurrentStepIndex(null);
  };

  // Tự động update currentStepIndex khi user di chuyển
  useEffect(() => {
    if (!steps || steps.length === 0) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const idx = steps.findIndex((step) => {
          const [lat, lng] =
            step.geometry?.coordinates?.[0] || [step.start_location?.lat, step.start_location?.lng];
          const distance = Math.sqrt((latitude - lat) ** 2 + (longitude - lng) ** 2) * 111000;
          return distance < 20;
        });
        if (idx !== -1) setCurrentStepIndex(idx);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [steps]);

  return {
    route,
    steps,
    currentStepIndex,
    directionsDestination,
    durationText,
    loadingDirections,
    handleDirections,
    exitDirections,
  };
};
