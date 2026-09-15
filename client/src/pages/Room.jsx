import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function Room() {

  const { id } = useParams();

  const [room, setRoom] = useState(null);

  useEffect(() => {

    const getRoom = async () => {
      try {
        const response = await API.get(`/rooms/${id}`);

        console.log(response.data);

        setRoom(response.data.data);

      } catch (error) {
        console.log(error);
      }
    };

    getRoom();

  }, [id]);

  if (!room) {
    return <h1>Loading...</h1>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-3xl font-bold" style={{ marginBottom: "15px" }}>
        {room.name}
      </h1>

      {room.images && room.images.length > 0 && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
          {room.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${room.name} ${idx + 1}`}
              style={{ width: "150px", height: "120px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ))}
        </div>
      )}

      <p><strong>Description:</strong> {room.description}</p>
      <p><strong>Capacity:</strong> {room.capacity}</p>
      <p><strong>Price:</strong> ${room.price}</p>
      <p><strong>Type:</strong> {room.bhkType || "N/A"}</p>
      <p><strong>Independent:</strong> {room.isIndependent ? "Yes" : "No"}</p>
      <p><strong>Status:</strong> {room.status || "available"}</p>
    </div>
  );
}

export default Room;