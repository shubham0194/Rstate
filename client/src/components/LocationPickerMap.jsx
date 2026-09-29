import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
    },
  });
  return null;
}

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
      map.setView([lat, lng], Math.max(map.getZoom(), 14));
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationChange,
  height = "320px",
}) {
  const defaultCenter = [28.4744, 77.504]; // Default (e.g. Greater Noida)

  const hasCoords =
    latitude !== "" &&
    longitude !== "" &&
    latitude != null &&
    longitude != null &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude));

  const currentLat = hasCoords ? Number(latitude) : null;
  const currentLng = hasCoords ? Number(longitude) : null;
  const center = hasCoords ? [currentLat, currentLng] : defaultCenter;

  const handleMarkerDrag = (e) => {
    const { lat, lng } = e.target.getLatLng();
    onLocationChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        onLocationChange(lat, lng);
      },
      (error) => {
        alert("Unable to retrieve your location: " + error.message);
      }
    );
  };

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 mb-2">
        <span className="font-medium text-gray-700">
          📍 Click on the map or drag the pin to set exact coordinates
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 shadow-2xs hover:bg-gray-50 cursor-pointer"
          >
            🎯 Use My Location
          </button>
          {hasCoords && (
            <button
              type="button"
              onClick={() => onLocationChange("", "")}
              className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 cursor-pointer"
            >
              Clear Pin
            </button>
          )}
        </div>
      </div>

      <div
        className="border border-gray-300 rounded-lg overflow-hidden relative shadow-2xs"
        style={{ height, width: "100%" }}
      >
        <MapContainer
          center={center}
          zoom={hasCoords ? 14 : 11}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onSelect={onLocationChange} />

          {hasCoords && (
            <>
              <RecenterMap lat={currentLat} lng={currentLng} />
              <Marker
                position={[currentLat, currentLng]}
                draggable={true}
                eventHandlers={{ dragend: handleMarkerDrag }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {hasCoords ? (
        <p className="text-xs text-emerald-700 mt-1.5 font-medium">
          ✓ Selected Coordinates: Latitude: {currentLat}, Longitude: {currentLng}
        </p>
      ) : (
        <p className="text-xs text-gray-400 mt-1.5">
          No coordinates pinned yet. Click anywhere on the map above to drop a pin.
        </p>
      )}
    </div>
  );
}
