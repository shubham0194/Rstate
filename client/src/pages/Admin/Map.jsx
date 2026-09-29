import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import API from "../../api/api";
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

function Map() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Default center: Greater Noida
    const defaultPosition = [28.4744, 77.504];

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);

                const response = await API.get("/rooms");

                setRooms(response.data.data || []);
            } catch (error) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load properties."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const roomsWithCoordinates = rooms.filter(
        (room) =>
            room.location?.latitude != null &&
            room.location?.longitude != null &&
            room.location?.latitude !== "" &&
            room.location?.longitude !== "" &&
            !isNaN(Number(room.location.latitude)) &&
            !isNaN(Number(room.location.longitude))
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">
                Property Map
            </h1>

            <p className="text-gray-600 mb-6">
                View your properties on the map.
            </p>

            {errorMessage && (
                <p className="text-red-600 mb-4">
                    {errorMessage}
                </p>
            )}

            {loading ? (
                <p>Loading properties...</p>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <MapContainer
                        center={defaultPosition}
                        zoom={11}
                        style={{
                            height: "600px",
                            width: "100%",
                        }}
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {roomsWithCoordinates.map((room) => (
                            <Marker
                                key={room._id}
                                position={[
                                    Number(room.location.latitude),
                                    Number(room.location.longitude),
                                ]}
                            >
                                <Popup>
                                    <div>
                                        <h2 className="font-bold">
                                            {room.name}
                                        </h2>

                                        <p>
                                            {room.location?.locality},{" "}
                                            {room.location?.city}
                                        </p>

                                        <p>
                                            Price: ₹{room.price}
                                        </p>

                                        <p>
                                            Status:{" "}
                                            {room.status || "available"}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}

            {!loading && roomsWithCoordinates.length === 0 && (
                <p className="text-gray-500 mt-4">
                    No properties have map coordinates yet.
                </p>
            )}
        </div>
    );
}

export default Map;
