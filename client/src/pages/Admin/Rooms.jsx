import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../../api/api";

const formatLocation = (location) => {
  if (typeof location === "string") return location;

  return [location?.locality, location?.city, location?.state]
    .filter(Boolean)
    .join(", ") || "No location";
};

function AdminRooms() {
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [bhkType, setBhkType] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchRooms = async (overrideParams) => {
    try {
      const params = {};
      const curSearch = overrideParams?.search !== undefined ? overrideParams.search : search;
      const curStatus = overrideParams?.status !== undefined ? overrideParams.status : status;
      const curBhk = overrideParams?.bhkType !== undefined ? overrideParams.bhkType : bhkType;
      const curSort = overrideParams?.sort !== undefined ? overrideParams.sort : sort;

      if (curSearch) params.search = curSearch;
      if (curStatus) params.status = curStatus;
      if (curBhk) params.bhkType = curBhk;
      if (curSort) params.sort = curSort;

      const response = await API.get("/rooms", { params });
      setRooms(response.data.data || []);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to load rooms.");
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
    setStatus("");
    setBhkType("");
    setSort("newest");
    fetchRooms({ search: "", status: "", bhkType: "", sort: "newest" });
  };

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

      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      {/* Filter, Search, and Sort Controls */}
      <form onSubmit={handleSearchSubmit} className="border p-4 rounded mb-6 flex flex-col gap-3">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search rooms (name, location, description)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded flex-1 min-w-[200px]"
          />

          <select
            value={bhkType}
            onChange={(e) => setBhkType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All BHK Types</option>
            <option value="1RK">1 RK</option>
            <option value="2RK">2 RK</option>
            <option value="1BHK">1 BHK</option>
            <option value="2BHK">2 BHK</option>
            <option value="3BHK">3 BHK</option>
            <option value="custom">Custom</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded">
              Search / Filter
            </button>
            <button type="button" onClick={handleReset} className="border px-4 py-2 rounded">
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border p-2 rounded"
            >
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

      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room._id} className="border rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{room.name}</h2>
              {room.images && room.images.length > 0 && (
                <div style={{ display: "flex", gap: "6px", margin: "8px 0", flexWrap: "wrap" }}>
                  {room.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${room.name} ${idx + 1}`}
                      style={{ width: "60px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ccc" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ))}
                </div>
              )}
              <p><strong>Description:</strong> {room.description}</p>
              <p><strong>Location:</strong> {formatLocation(room.location)}</p>
              <p><strong>Capacity:</strong> {room.capacity}</p>
              <p><strong>Type:</strong> {room.bhkType || "N/A"}</p>
              <p><strong>Independent:</strong> {room.isIndependent ? "Yes" : "No"}</p>
              <p><strong>Price:</strong> ${room.price}</p>
              <p><strong>Status:</strong> {room.status || "available"}</p>
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
