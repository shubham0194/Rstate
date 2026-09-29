import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function Room() {

  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddFavorite = async () => {
    if (isFavorite) {
      return;
    }

    if (!localStorage.getItem("token")) {
      setFavoriteMessage("Please log in to add a room to your favorites.");
      return;
    }

    try {
      const response = await API.post(`/favorites/${id}`);
      setIsFavorite(true);
      setFavoriteMessage(response.data.message || "Room added to your favorites.");
    } catch (error) {
      setFavoriteMessage(error.response?.data?.message || "Unable to add room to your favorites.");
    }
  };

  const handleRemoveFavorite = async () => {
    if (!localStorage.getItem("token")) {
      setFavoriteMessage("Please log in to manage your favorites.");
      return;
    }

    try {
      const response = await API.delete(`/favorites/${id}`);
      setIsFavorite(false);
      setFavoriteMessage(response.data.message || "Room removed from favorites.");
    } catch (error) {
      setFavoriteMessage(error.response?.data?.message || "Unable to remove room from favorites.");
    }
  };

  useEffect(() => {
    const getRoom = async () => {
      try {
        const response = await API.get(`/rooms/${id}`);
        setRoom(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const checkFavorite = async () => {
      if (!localStorage.getItem("token")) return;
      try {
        const response = await API.get("/favorites");
        const favs = response.data.data || [];
        const isFav = favs.some((f) => String(f.room?._id || f.room) === String(id));
        setIsFavorite(isFav);
      } catch (error) {
        console.log("Failed to check favorite status:", error);
      }
    };

    getRoom();
    checkFavorite();
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
      <p style={{ margin: '8px 0' }}>
        <strong>Status:</strong>{" "}
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 600,
          backgroundColor: room.status === 'rented' ? '#fef3c7' : '#d1fae5',
          color: room.status === 'rented' ? '#92400e' : '#065f46'
        }}>
          {room.status === 'rented' ? 'Rented' : 'Available'}
        </span>
      </p>
      {isFavorite ? (
        <button
          type="button"
          onClick={handleRemoveFavorite}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          Remove Favorite
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAddFavorite}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          Add to Favorites
        </button>
      )}
      {favoriteMessage && (
        <p style={{ color: "green", marginTop: "10px" }}>{favoriteMessage}</p>
      )}
    </div>
  );
}

export default Room;