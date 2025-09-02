import { useState, useEffect } from "react";
import MapView from "../components/MapView";
import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";
import DirectionsStep from "../components/DirectionsStep";
import { searchNearby } from "../services/placeServices/searchPlace";
import axios from "axios";

export default function MapPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [results, setResults] = useState([]);
  const [route, setRoute] = useState(null);
  const [radius, setRadius] = useState(4);
  const [flyToPosition, setFlyToPosition] = useState(null);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [directionsDestination, setDirectionsDestination] = useState(null);
  const [durationText, setDurationText] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSearch = async ({ name, category, radius }) => {
    if (!userLocation) return;
    setRadius(radius);
    try {
      const data = await searchNearby(userLocation.lat, userLocation.lng, radius, name, category);
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDirections = async (place) => {
    if (!userLocation) return;
    setLoadingDirections(true);
    const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjVlMjMxNjJjNGViMTQyZjc4ZjlmMzk5YzRkNTIxM2FmIiwiaCI6Im11cm11cjY0In0=";
    const start = `${userLocation.lng},${userLocation.lat}`;
    const end = `${place.longitude},${place.latitude}`;
    try {
      const res = await axios.get(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        { params: { start, end }, headers: { Authorization: API_KEY } }
      );
      const coordinates = res.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRoute(coordinates);
      setSteps(res.data.features[0].properties.segments[0].steps);
      setCurrentStepIndex(0);
      setDirectionsDestination(place.name);
      const durationSec = res.data.features[0].properties.segments[0].duration;
      const mins = Math.round(durationSec / 60);
      setDurationText(`${mins} phút`);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy đường đi thực tế");
    } finally {
      setLoadingDirections(false);
    }
  };

  const handleDetail = (place) => {
    alert(`Chi tiết:\n${place.name}\n${place.address}`);
  };

  const handleSelectPlace = (place) => {
    setFlyToPosition([Number(place.latitude), Number(place.longitude)]);
  };

  const exitDirections = () => {
    setSteps([]);
    setRoute(null);
    setDirectionsDestination(null);
    setCurrentStepIndex(null);
  };

  // Giám sát người dùng để highlight step hiện tại
  useEffect(() => {
    if (!steps || steps.length === 0) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const idx = steps.findIndex((step) => {
          const [lat, lng] = step.geometry?.coordinates?.[0] || [step.start_location?.lat, step.start_location?.lng];
          const dLat = latitude - lat;
          const dLng = longitude - lng;
          const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111000; // approx meters
          return distance < 20;
        });
        if (idx !== -1) setCurrentStepIndex(idx);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 1000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [steps]);

  if (!userLocation) return <div>Đang lấy vị trí...</div>;

  return (
    <div className="flex h-screen w-screen">
      <div className="w-3/4 h-full">
        <MapView
          userLocation={userLocation}
          results={results}
          route={route}
          radius={radius}
          flyToPosition={flyToPosition}
          steps={steps}
        />
      </div>

      <div className="w-1/4 h-full rounded-xl bg-gray-200 shadow-xl flex flex-col">
        <div className="p-4">
          {!steps.length ? (
            <SearchBar onSearch={handleSearch} />
          ) : null}
        </div>

        <div className="flex-1 p-4 overflow-auto scrollbar-hide">
          {!steps.length ? (
            <ResultList
              results={results}
              onDirections={handleDirections}
              onDetail={handleDetail}
              onSelectPlace={handleSelectPlace}
              loadingDirections={loadingDirections}
              userLocation={userLocation}
            />
          ) : (
            <DirectionsStep
              steps={steps}
              exitDirections={exitDirections}
              destinationName={directionsDestination}
              duration={durationText}
              currentStepIndex={currentStepIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
}
