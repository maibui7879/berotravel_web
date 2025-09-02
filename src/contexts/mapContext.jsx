import { createContext, useContext, useState, useEffect } from "react";

const MapContext = createContext();
export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchRadius, setSearchRadius] = useState("");

  useEffect(() => {
    const savedResults = localStorage.getItem("results");
    const savedPlace = localStorage.getItem("selectedPlace");
    const savedFilter = localStorage.getItem("filterCategory");
    const savedRoute = localStorage.getItem("routeCoords");
    const savedText = localStorage.getItem("searchText");
    const savedRadius = localStorage.getItem("searchRadius");

    if (savedResults) setResults(JSON.parse(savedResults));
    if (savedPlace) setSelectedPlace(JSON.parse(savedPlace));
    if (savedFilter) setFilterCategory(savedFilter);
    if (savedRoute) setRouteCoords(JSON.parse(savedRoute));
    if (savedText) setSearchText(savedText);
    if (savedRadius) setSearchRadius(savedRadius);
  }, []);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    if (selectedPlace)
      localStorage.setItem("selectedPlace", JSON.stringify(selectedPlace));
  }, [selectedPlace]);

  useEffect(() => {
    localStorage.setItem("filterCategory", filterCategory);
  }, [filterCategory]);

  useEffect(() => {
    localStorage.setItem("routeCoords", JSON.stringify(routeCoords));
  }, [routeCoords]);

  useEffect(() => {
    localStorage.setItem("searchText", searchText);
  }, [searchText]);

  useEffect(() => {
    localStorage.setItem("searchRadius", searchRadius);
  }, [searchRadius]);

  return (
    <MapContext.Provider
      value={{
        results,
        setResults,
        selectedPlace,
        setSelectedPlace,
        filterCategory,
        setFilterCategory,
        routeCoords,
        setRouteCoords,
        searchText,
        setSearchText,
        searchRadius,
        setSearchRadius,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
