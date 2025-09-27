import { createContext, useState, useEffect, useContext } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);

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

  return <MapContext.Provider value={{ userLocation }}>{children}</MapContext.Provider>;
};

export const useMap = () => useContext(MapContext);
