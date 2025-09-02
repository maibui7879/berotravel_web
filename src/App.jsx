import { MapProvider } from "./contexts/mapContext";
import MapPage from "./pages/mapPage";
import "antd/dist/reset.css";

export default function App() {
  return (
    <MapProvider>
      <MapPage />
    </MapProvider>
  );
}
