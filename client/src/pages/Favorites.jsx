
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await API.get("/favorites");
        setFavorites(response.data.data || []);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Unable to load your favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (roomId) => {
    try {
      await API.delete(`/favorites/${roomId}`);
      setFavorites((currentFavs) => currentFavs.filter((f) => String(f.room?._id || f.room) !== String(roomId)));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to remove room from favorites.");
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading your favorites...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-3xl font-bold">Your Favorites</h1>
      {errorMessage && <p style={{ color: "red", marginTop: "12px" }}>{errorMessage}</p>}
      {!errorMessage && favorites.length === 0 && (
        <p style={{ marginTop: "12px" }}>You have not added any favorite rooms yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        {favorites.map(({ room }) => (
          <article key={room._id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
            {room.images?.length > 0 && (
              <img
                src={room.images[0]}
                alt={room.name}
                style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "4px" }}
              />
            )}
            <h2 style={{ marginTop: "10px" }}>{room.name}</h2>
            <p>Price: ${room.price}</p>
            <p>Type: {room.bhkType || "N/A"}</p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "10px" }}>
              <Link to={`/room/${room._id}`} style={{ color: "blue" }}>
                View room
              </Link>
              <button
                type="button"
                onClick={() => handleRemoveFavorite(room._id)}
                style={{ padding: "6px 12px", cursor: "pointer" }}
              >
                Remove Favorite
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Favorites;