import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import { searchNearby } from "../../services/placeServices/searchPlace";
import axios from "axios";

export default function MapPage() {
  const [loading, setLoading] = useState(false);
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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mobileFull, setMobileFull] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const savedLocation = sessionStorage.getItem("userLocation");
    if (savedLocation) setUserLocation(JSON.parse(savedLocation));

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (pos.coords.accuracy < 200) {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          sessionStorage.setItem("userLocation", JSON.stringify(loc));
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("cat") || "";
    const r = parseInt(searchParams.get("r") || "4", 10);
    const p = parseInt(searchParams.get("page") || "1", 10);
    const directions = searchParams.get("directions");

    if (q || cat) handleSearch({ name: q, category: cat, radius: r, page: p }, directions);
  }, [userLocation]);

  const handleSearch = async ({ name, category, radius, page = 1 }, autoDirectionsId = null) => {
    if (!userLocation) return;
    setLoading(true);
    setSearched(true);
    setResults([]);
    setRadius(radius);

    setSearchParams({ q: name, cat: category, r: radius, page });

    try {
      const data = await searchNearby(
        userLocation.lat,
        userLocation.lng,
        radius,
        name,
        category,
        page,
        10
      );
      setResults(data.data);
      setPage(data.page);
      setTotal(data.total);

      const placeId = autoDirectionsId || searchParams.get("directions");
      if (placeId) {
        const found = data.data.find((p) => p._id === placeId);
        if (found) handleDirections(found, true);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!userLocation) return;
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("cat") || "";
    const r = parseInt(searchParams.get("r") || radius, 10);

    let nextPage = page + 1;

    setLoading(true);

    try {
      const data = await searchNearby(
        userLocation.lat,
        userLocation.lng,
        r,
        q,
        cat,
        nextPage,
        10
      );

      if (nextPage > data.totalPages) {
        nextPage = 1;
        const resetData = await searchNearby(
          userLocation.lat,
          userLocation.lng,
          r,
          q,
          cat,
          nextPage,
          10
        );
        setResults(resetData.data);
        setPage(resetData.page);
      } else {
        setResults(data.data);
        setPage(data.page);
      }

      setSearchParams({ q, cat, r, page: nextPage });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleDirections = async (place, silent = false) => {
    if (!userLocation) return;
    setLoadingDirections(true);

    if (!silent) {
      setSearchParams((prev) => {
        const q = prev.get("q") || "";
        const cat = prev.get("cat") || "";
        const r = prev.get("r") || radius;
        return { q, cat, r, page, directions: place._id };
      });
    }

    const API_KEY =
      "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjVlMjMxNjJjNGViMTQyZjc4ZjlmMzk5YzRkNTIxM2FmIiwiaCI6Im11cm11cjY0In0=";
    const start = `${userLocation.lng},${userLocation.lat}`;
    const end = `${place.longitude},${place.latitude}`;

    try {
      const res = await axios.get("https://api.openrouteservice.org/v2/directions/driving-car", {
        params: { start, end },
        headers: { Authorization: API_KEY },
      });
      const coordinates = res.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRoute(coordinates);
      setSteps(res.data.features[0].properties.segments[0].steps);
      setCurrentStepIndex(0);
      setDirectionsDestination(place.name);
      const durationSec = res.data.features[0].properties.segments[0].duration;
      setDurationText(`${Math.round(durationSec / 60)} phút`);
      setDrawerOpen(true);
      setMobileFull(false);
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
    setMobileFull(false);

    setSearchParams((prev) => {
      const q = prev.get("q") || "";
      const cat = prev.get("cat") || "";
      const r = prev.get("r") || radius;
      return { q, cat, r, page };
    });
  };

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

  if (!userLocation)
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100 md:overflow-y-hidden">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium">Đang lấy vị trí...</p>
        </div>
      </div>
    );

  return (
    <div className="relative h-screen w-screen md:overflow-y-hidden">
      {/* MapView full screen */}
      <div className="h-full w-full">
        <MapView
          userLocation={userLocation}
          results={results}
          route={route}
          radius={radius}
          flyToPosition={flyToPosition}
          steps={steps}
        />
        {!steps.length && <SearchBar onSearch={handleSearch} />}
        <Sidebar
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          mobileFull={mobileFull}
          setMobileFull={setMobileFull}
          steps={steps}
          results={results}
          total={total}
          handleSearch={handleSearch}
          handleDirections={handleDirections}
          handleDetail={(p) => alert(`Chi tiết:\n${p.name}\n${p.address}`)}
          handleSelectPlace={(p) => setFlyToPosition([+p.latitude, +p.longitude])}
          loadingDirections={loadingDirections}
          userLocation={userLocation}
          exitDirections={exitDirections}
          directionsDestination={directionsDestination}
          durationText={durationText}
          currentStepIndex={currentStepIndex}
          loading={loading}
          searched={searched}
          page={page}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
