import { useEffect, useState } from "react";
import API from "../api/api";

function Rooms() {

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [search, setSearch] = useState("");
    const [bhkType, setBhkType] = useState("");
    const [status, setStatus] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [sort, setSort] = useState("newest");

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

    useEffect(() => {
        fetchRooms();
    }, [sort]);

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

    const openModal = (room) => {
        setSelectedRoom(room);
    };

    const closeModal = () => {
        setSelectedRoom(null);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Available Rooms</h1>

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
                        <option value="sold">Sold</option>
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
                        onClick={() => openModal(room)}
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
                        <p style={{ color: 'blue', fontSize: '14px', marginTop: '10px' }}>Click to view details</p>
                    </div>
                ))}
            </div>

            {selectedRoom && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '20px', borderRadius: '5px',
                        maxWidth: '500px', width: '90%', maxHeight: '85vh', overflowY: 'auto'
                    }}>
                        <h2 style={{ marginBottom: '10px' }}>{selectedRoom.name}</h2>
                        {selectedRoom.images && selectedRoom.images.length > 0 && (
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {selectedRoom.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`${selectedRoom.name} ${idx + 1}`}
                                            style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <p><strong>Description:</strong> {selectedRoom.description}</p>
                        <p><strong>Capacity:</strong> {selectedRoom.capacity}</p>
                        <p><strong>Price:</strong> ${selectedRoom.price}</p>
                        <p><strong>Type:</strong> {selectedRoom.bhkType || "N/A"}</p>
                        <p><strong>Independent:</strong> {selectedRoom.isIndependent ? "Yes" : "No"}</p>
                        <p><strong>Status:</strong> {selectedRoom.status || "available"}</p>
                        
                        {/* Notice location is excluded as requested */}

                        <button onClick={closeModal} style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Rooms;