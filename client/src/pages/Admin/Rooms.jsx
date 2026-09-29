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
  const [selectedRoom, setSelectedRoom] = useState(null);
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
      const roomList = response.data.data || [];
      setRooms(roomList);

      // Keep selectedRoom updated if open
      if (selectedRoom) {
        const refreshed = roomList.find((r) => r._id === selectedRoom._id);
        if (refreshed) {
          setSelectedRoom(refreshed);
        }
      }
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
      if (selectedRoom && selectedRoom._id === id) {
        setSelectedRoom(null);
      }
      fetchRooms();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to delete the room.");
    }
  };

  const handleToggleStatus = async (e, room) => {
    e.stopPropagation();
    const nextStatus = room.status === "rented" ? "available" : "rented";
    try {
      const response = await API.put(`/rooms/${room._id}`, { status: nextStatus });
      const updatedRoom = response.data?.data;
      if (selectedRoom && selectedRoom._id === room._id && updatedRoom) {
        setSelectedRoom(updatedRoom);
      }
      fetchRooms();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to update room status.");
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
          </select>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-2">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded cursor-pointer">
              Search / Filter
            </button>
            <button type="button" onClick={handleReset} className="border px-4 py-2 rounded cursor-pointer">
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

      {/* Simplified Rooms List (Only Name and Type + Actions) */}
      <div className="space-y-3">
        {rooms.length === 0 && (
          <p className="text-gray-500 py-4">No rooms found.</p>
        )}

        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => setSelectedRoom(room)}
            className="group border border-gray-200 hover:border-black bg-white rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition shadow-xs hover:shadow-sm"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">
                {room.name}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Type: <span className="font-medium text-gray-800">{room.bhkType || "N/A"}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">Click to view details</p>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              {/* Opposite status button */}
              <button
                type="button"
                onClick={(e) => handleToggleStatus(e, room)}
                className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer border transition ${
                  room.status === "rented"
                    ? "border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    : "border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100"
                }`}
              >
                {room.status === "rented" ? "Mark as Available" : "Mark as Rented"}
              </button>

              {/* Edit button */}
              <Link
                to={`/admin/edit/${room._id}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-black text-white hover:bg-gray-800 px-3 py-1.5 rounded text-xs font-medium cursor-pointer"
              >
                Edit
              </Link>

              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(room._id);
                }}
                className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded text-xs font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedRoom.name}</h3>
                <span
                  className={`mt-1.5 inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                    selectedRoom.status === "rented"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  Status: {selectedRoom.status === "rented" ? "Rented" : "Available"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Images */}
            {selectedRoom.images && selectedRoom.images.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Images</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedRoom.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${selectedRoom.name} ${idx + 1}`}
                      className="h-28 w-36 shrink-0 rounded-lg object-cover border border-gray-200"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Details List */}
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong className="text-gray-900">Type:</strong> {selectedRoom.bhkType || "N/A"}
              </p>
              <p>
                <strong className="text-gray-900">Price:</strong> ${selectedRoom.price}
              </p>
              <p>
                <strong className="text-gray-900">Capacity:</strong> {selectedRoom.capacity}
              </p>
              <p>
                <strong className="text-gray-900">Independent:</strong>{" "}
                {selectedRoom.isIndependent ? "Yes" : "No"}
              </p>
              <p>
                <strong className="text-gray-900">Location:</strong>{" "}
                {formatLocation(selectedRoom.location)}
              </p>
              <div>
                <strong className="text-gray-900">Description:</strong>
                <p className="mt-1 text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 whitespace-pre-wrap">
                  {selectedRoom.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <button
                type="button"
                onClick={(e) => handleToggleStatus(e, selectedRoom)}
                className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer border ${
                  selectedRoom.status === "rented"
                    ? "border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    : "border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100"
                }`}
              >
                {selectedRoom.status === "rented" ? "Mark as Available" : "Mark as Rented"}
              </button>

              <div className="flex gap-2">
                <Link
                  to={`/admin/edit/${selectedRoom._id}`}
                  className="bg-black text-white hover:bg-gray-800 px-4 py-1.5 rounded text-xs font-medium"
                >
                  Edit Room
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-1.5 rounded text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRooms;
