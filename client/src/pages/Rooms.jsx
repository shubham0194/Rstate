import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Rooms() {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);

    const [search, setSearch] = useState("");
    const [bhkType, setBhkType] = useState("");
    const [status, setStatus] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [sort, setSort] = useState("newest");
    const [favoriteMessage, setFavoriteMessage] = useState("");
    const [favoriteRoomIds, setFavoriteRoomIds] = useState([]);

    const fetchRooms = async (overrideParams) => {
        try {
            const params = {};
            const currentSearch = overrideParams?.search !== undefined ? overrideParams.search : search;
            const currentBhk = overrideParams?.bhkType !== undefined ? overrideParams.bhkType : bhkType;
            const currentStatus = overrideParams?.status !== undefined ? overrideParams.status : status;
            const currentMinPrice = overrideParams?.minPrice !== undefined ? overrideParams.minPrice : minPrice;
            const currentMaxPrice = overrideParams?.maxPrice !== undefined ? overrideParams.maxPrice : maxPrice;
            const currentCapacity = overrideParams?.capacity !== undefined ? overrideParams.capacity : capacity;
            const currentSort = overrideParams?.sort !== undefined ? overrideParams.sort : sort;

            if (currentSearch) params.search = currentSearch;
            if (currentBhk) params.bhkType = currentBhk;
            if (currentStatus) params.status = currentStatus;
            if (currentMinPrice) params.minPrice = currentMinPrice;
            if (currentMaxPrice) params.maxPrice = currentMaxPrice;
            if (currentCapacity) params.capacity = currentCapacity;
            if (currentSort) params.sort = currentSort;

            const response = await API.get("/rooms", { params });
            setRooms(response.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchFavorites = async () => {
        if (!localStorage.getItem("token")) {
            return;
        }
        try {
            const response = await API.get("/favorites");
            const favs = response.data.data || [];
            const ids = favs.map((f) => String(f.room?._id || f.room)).filter(Boolean);
            setFavoriteRoomIds(ids);
        } catch (error) {
            console.log("Failed to fetch favorites:", error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [sort]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchRooms();
    };

    const handleReset = () => {
        setSearch("");
        setBhkType("");
        setStatus("");
        setMinPrice("");
        setMaxPrice("");
        setCapacity("");
        setSort("newest");
        fetchRooms({
            search: "",
            bhkType: "",
            status: "",
            minPrice: "",
            maxPrice: "",
            capacity: "",
            sort: "newest" 
        });
    };
    

    const handleAddFavorite = async (e, roomId) => {
        e.stopPropagation();

        const idStr = String(roomId);
        if (favoriteRoomIds.includes(idStr)) {
            return;
        }

        if (!localStorage.getItem("token")) {
            setFavoriteMessage("Please log in to add a room to your favorites.");
            return;
        }

        try {
            const response = await API.post(`/favorites/${roomId}`);
            setFavoriteRoomIds((currentIds) => [...currentIds, idStr]);
            setFavoriteMessage(response.data.message || "Room added to your favorites.");
        } catch (error) {
            setFavoriteMessage(error.response?.data?.message || "Unable to add room to your favorites.");
        }
    };

    const handleRemoveFavorite = async (e, roomId) => {
        e.stopPropagation();

        if (!localStorage.getItem("token")) {
            setFavoriteMessage("Please log in to manage your favorites.");
            return;
        }

        const idStr = String(roomId);

        try {
            const response = await API.delete(`/favorites/${roomId}`);
            setFavoriteRoomIds((currentIds) => currentIds.filter((id) => id !== idStr));
            setFavoriteMessage(response.data.message || "Room removed from favorites.");
        } catch (error) {
            setFavoriteMessage(error.response?.data?.message || "Unable to remove room from favorites.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Available Rooms</h1>
            {favoriteMessage && (
                <p style={{ color: 'green', marginTop: '10px' }}>{favoriteMessage}</p>
            )}

            {/* Filter, Search, and Sort Controls */}
            <form onSubmit={handleSearchSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginTop: '15px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search rooms (name, location, description)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, minWidth: '200px', padding: '6px' }}
                    />

                    <select value={bhkType} onChange={(e) => setBhkType(e.target.value)} style={{ padding: '6px' }}>
                        <option value="">All BHK Types</option>
                        <option value="1RK">1 RK</option>
                        <option value="2RK">2 RK</option>
                        <option value="1BHK">1 BHK</option>
                        <option value="2BHK">2 BHK</option>
                        <option value="3BHK">3 BHK</option>
                        <option value="custom">Custom</option>
                    </select>

                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '6px' }}>
                        <option value="">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        style={{ width: '100px', padding: '6px' }}
                    />

                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        style={{ width: '100px', padding: '6px' }}
                    />

                    <input
                        type="number"
                        placeholder="Min Capacity"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        style={{ width: '110px', padding: '6px' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" style={{ padding: '6px 14px', cursor: 'pointer' }}>Search / Filter</button>
                        <button type="button" onClick={handleReset} style={{ padding: '6px 14px', cursor: 'pointer' }}>Reset</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label><strong>Sort by:</strong></label>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '6px' }}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="capacity-asc">Capacity: Low to High</option>
                            <option value="capacity-desc">Capacity: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                        </select>
                    </div>
                </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                {rooms.map((room) => (
                    <div 
                        key={room._id}
                        style={{ border: '1px solid #ccc', padding: '15px', cursor: 'pointer', borderRadius: '5px' }}
                        onClick={() => navigate(`/room/${room._id}`)}
                    >
                        {room.images && room.images.length > 0 && (
                            <img
                                src={room.images[0]}
                                alt={room.name}
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <h2>{room.name}</h2>
                        <p>Price: ${room.price}</p>
                        <p>Type: {room.bhkType || "N/A"}</p>
                        <p style={{ margin: '6px 0' }}>
                            <strong>Status:</strong>{" "}
                            <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                backgroundColor: room.status === 'rented' ? '#fef3c7' : '#d1fae5',
                                color: room.status === 'rented' ? '#92400e' : '#065f46'
                            }}>
                                {room.status === 'rented' ? 'Rented' : 'Available'}
                            </span>
                        </p>
                        {favoriteRoomIds.includes(String(room._id)) ? (
                            <button
                                type="button"
                                onClick={(e) => handleRemoveFavorite(e, room._id)}
                                style={{ padding: '8px 12px', cursor: 'pointer' }}
                            >
                                Remove Favorite
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => handleAddFavorite(e, room._id)}
                                style={{ padding: '8px 12px', cursor: 'pointer' }}
                            >
                                Add to Favorites
                            </button>
                        )}
                        <p style={{ color: 'blue', fontSize: '14px', marginTop: '10px' }}>Click to view details</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Rooms;