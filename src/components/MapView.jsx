// MapView.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import { useEffect } from "react";

function FlyToMarker({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && position.length === 2) {
      map.flyTo([Number(position[0]), Number(position[1])], 16, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function MapView({ userLocation, results, route, radius, flyToPosition, onMarkerClick }) {
  return (
    <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={14} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>Bạn đang ở đây</Popup>
      </Marker>

      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={radius * 1000}
        pathOptions={{ color: "blue", fillOpacity: 0.1 }}
      />

      {results.map((place, idx) => (
        <Marker
          key={idx}
          position={[Number(place.latitude), Number(place.longitude)]}
          eventHandlers={{
            click: () => onMarkerClick([Number(place.latitude), Number(place.longitude)]),
          }}
        >
          <Popup>{place.name}</Popup>
        </Marker>
      ))}

      {route && <Polyline positions={route.map(([lat, lng]) => [lat, lng])} color="green" />}
      
      <FlyToMarker position={flyToPosition} />
    </MapContainer>
  );
}
