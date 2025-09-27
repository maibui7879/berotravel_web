import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, useMapEvents } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import AddPlaceModal from "./AddPlaceModal";

const defaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -45],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // icon màu khác (ví dụ xanh)
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const activeIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [35, 55],
  iconAnchor: [17, 55],
  popupAnchor: [0, -45],
});

function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && position.length === 2) {
      map.flyTo([Number(position[0]), Number(position[1])], 16, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function MapView({ userLocation, results, route, radius, flyToPosition, onMarkerClick }) {
  const [newMarker, setNewMarker] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [activePlaceId, setActivePlaceId] = useState(null);

  const markerRefs = useRef({});

  useEffect(() => {
    if (flyToPosition && results.length > 0) {
      const matched = results.find(
        (p) =>
          Number(p.latitude) === Number(flyToPosition[0]) &&
          Number(p.longitude) === Number(flyToPosition[1])
      );
      if (matched) {
        setActivePlaceId(matched._id);
        if (markerRefs.current[matched._id]) {
          markerRefs.current[matched._id].openPopup();
        }
      }
    }
  }, [flyToPosition, results]);

  const handleAddPlace = (pos) => {
    setSelectedPosition(pos);
    setShowAddModal(true);
    setNewMarker(null);
  };

  return (
    <>
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickHandler onClick={(pos) => setNewMarker(pos)} />

        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup closeButton={false}>Bạn đang ở đây</Popup>
        </Marker>

        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={radius * 1000}
          pathOptions={{ color: "blue", fillOpacity: 0.1 }}
        />

        {results.map((place, idx) => {
          const isActive =
            flyToPosition &&
            Number(flyToPosition[0]) === Number(place.latitude) &&
            Number(flyToPosition[1]) === Number(place.longitude);

          return (
            <Marker
              key={place._id || idx}
              position={[Number(place.latitude), Number(place.longitude)]}
              icon={isActive ? activeIcon : defaultIcon}
              ref={(el) => (markerRefs.current[place._id] = el)}
              eventHandlers={{
                click: () => {
                  setActivePlaceId(place._id);
                  onMarkerClick([Number(place.latitude), Number(place.longitude)]);
                },
              }}
            >
              <Popup closeButton={false} autoPan={true}>
                {place.name}
              </Popup>
            </Marker>
          );
        })}

        {route && <Polyline positions={route.map(([lat, lng]) => [lat, lng])} color="blue" />}

        {newMarker && (
          <Marker position={newMarker} icon={activeIcon}>
            <Popup closeButton={false}>
              <div className="flex items-center gap-2">
                <span
                  className="cursor-pointer text-blue-600 font-semibold"
                  onClick={() => handleAddPlace(newMarker)}
                >
                  Thêm địa điểm?
                </span>
                <button
                  className="ml-2 text-red-500 font-bold"
                  onClick={() => setNewMarker(null)}
                >
                  ✕
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        <FlyToMarker position={flyToPosition} />
      </MapContainer>

      {showAddModal && selectedPosition && (
        <AddPlaceModal
          position={selectedPosition}
          onClose={() => {
            setShowAddModal(false);
            setSelectedPosition(null);
          }}
          onCreated={(created) => {
            console.log("Place mới:", created);
          }}
        />
      )}
    </>
  );
}
