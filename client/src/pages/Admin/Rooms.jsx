import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../../api/api";

function AdminRooms() {
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchRooms = async () => {
    try {
      const response = await API.get("/rooms");
      setRooms(response.data.data || []);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to load rooms.");
    }
  };

  useEffect(() => {
    let isCurrent = true;

    API.get("/rooms")
      .then((response) => {
        if (isCurrent) {
          setRooms(response.data.data || []);
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setErrorMessage(error.response?.data?.message || "Unable to load rooms.");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to delete the room.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rooms</h1>

      {location.state?.message && (
        <p className="mb-4 text-green-700">{location.state.message}</p>
      )}
      {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}

      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room._id} className="border rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{room.name}</h2>
              <p>{room.location || "No location"}</p>
              <p>{room.description}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Price: {room.price}</p>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/admin/edit/${room._id}`}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(room._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRooms;
