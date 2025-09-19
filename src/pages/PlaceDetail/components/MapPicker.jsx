import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
        },
      }}
    />
  ) : null;
}

export default function MapPicker({ position, setPosition }) {
  return (
    <div className="flex flex-col border rounded bg-white px-2">
      <h3 className="text-base font-semibold p-2 border-b mb-2">Chọn địa điểm</h3>
      <div className="flex-1 overflow-y-auto">
        <div className="h-60 w-full">
          <MapContainer
            center={position || [21.0278, 105.8342]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-2">
        <div>
          <label className="block text-sm font-medium text-gray-600">Latitude</label>
          <input
            type="number"
            value={position ? position[0] : ""}
            onChange={(e) =>
              setPosition([parseFloat(e.target.value) || 0, position ? position[1] : 0])
            }
            className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Longitude</label>
          <input
            type="number"
            value={position ? position[1] : ""}
            onChange={(e) =>
              setPosition([position ? position[0] : 0, parseFloat(e.target.value) || 0])
            }
            className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
