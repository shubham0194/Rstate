import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import LocationPickerMap from "../../components/LocationPickerMap";

function AddRoom() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [roomData, setRoomData] = useState({
    name: "",
    location: {
      locality: "",
      city: "",
      state: "",
      latitude: "",
      longitude: "",
    },
    isIndependent: false,
    bhkType: "custom",
    price: "",
    capacity: "",
    description: "",
    status: "available",
    images: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: name === "isIndependent" ? value === "true" : value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleMapLocationSelect = (lat, lng) => {
    setRoomData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: lat,
        longitude: lng,
      },
    }));
  };

  const handleImageChange = (index, value) => {
    setRoomData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = value;
      return { ...prev, images: updatedImages };
    });
  };

  const addImageField = () => {
    setRoomData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index) => {
    setRoomData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const createRoom = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const locationPayload = {
        locality: roomData.location.locality,
        city: roomData.location.city,
        state: roomData.location.state,
      };

      if (
        roomData.location.latitude !== "" &&
        roomData.location.latitude != null &&
        !isNaN(Number(roomData.location.latitude))
      ) {
        locationPayload.latitude = Number(roomData.location.latitude);
      }

      if (
        roomData.location.longitude !== "" &&
        roomData.location.longitude != null &&
        !isNaN(Number(roomData.location.longitude))
      ) {
        locationPayload.longitude = Number(roomData.location.longitude);
      }

      const payload = {
        name: roomData.name,
        location: locationPayload,
        price: Number(roomData.price),
        capacity: Number(roomData.capacity),
        description: roomData.description,
        status: "available",
        isIndependent: roomData.isIndependent,
        bhkType: roomData.bhkType,
        images: roomData.images.filter((url) => url.trim() !== ""),
      };

      const response = await API.post("/rooms", payload);

      setRoomData({
        name: "",
        location: {
          locality: "",
          city: "",
          state: "",
          latitude: "",
          longitude: "",
        },
        isIndependent: false,
        bhkType: "custom",
        price: "",
        capacity: "",
        description: "",
        status: "available",
        images: [""],
      });

      navigate("/admin/rooms", {
        state: {
          message: `Room "${response.data.data.name}" created successfully.`,
        },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to create the room. Please try again."
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Create Room</h1>

      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}

      <form onSubmit={createRoom} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Room Title</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Spacious 2BHK Near Metro"
            value={roomData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <fieldset className="border border-gray-300 rounded-lg p-4">
          <legend className="font-semibold text-sm px-1">Location Details</legend>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Locality</label>
              <input
                type="text"
                name="locality"
                placeholder="e.g. Sector 62"
                value={roomData.location.locality}
                onChange={handleLocationChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Noida"
                value={roomData.location.city}
                onChange={handleLocationChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Uttar Pradesh"
                value={roomData.location.state}
                onChange={handleLocationChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Latitude (Click on map to fill)
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                placeholder="e.g. 28.6139"
                value={roomData.location.latitude}
                onChange={handleLocationChange}
                className="w-full border border-gray-300 rounded p-2 bg-gray-50 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Longitude (Click on map to fill)
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                placeholder="e.g. 77.2090"
                value={roomData.location.longitude}
                onChange={handleLocationChange}
                className="w-full border border-gray-300 rounded p-2 bg-gray-50 font-mono text-sm"
              />
            </div>
          </div>

          {/* Interactive Mini Map */}
          <LocationPickerMap
            latitude={roomData.location.latitude}
            longitude={roomData.location.longitude}
            onLocationChange={handleMapLocationSelect}
          />
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Independent Property</label>
            <select
              name="isIndependent"
              value={String(roomData.isIndependent)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="false">No (Shared / Apartment)</option>
              <option value="true">Yes (Independent House / Floor)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">BHK Type</label>
            <select
              name="bhkType"
              value={roomData.bhkType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="1RK">1 RK</option>
              <option value="2RK">2 RK</option>
              <option value="1BHK">1 BHK</option>
              <option value="2BHK">2 BHK</option>
              <option value="3BHK">3 BHK</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              name="status"
              value={roomData.status || "available"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Price (₹ / month)</label>
            <input
              type="number"
              name="price"
              placeholder="e.g. 15000"
              value={roomData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Capacity (persons)</label>
            <input
              type="number"
              name="capacity"
              placeholder="e.g. 2"
              value={roomData.capacity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Detailed description of the room and amenities..."
            value={roomData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 h-24"
            required
          />
        </div>

        <fieldset className="border border-gray-300 rounded-lg p-4">
          <legend className="font-semibold text-sm px-1">Images (URLs)</legend>
          {roomData.images.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Image URL (e.g. https://images.unsplash.com/...)"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2 text-sm"
              />
              {roomData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-1 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-100 cursor-pointer"
          >
            + Add Another Image URL
          </button>
        </fieldset>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2.5 rounded font-medium hover:bg-gray-800 transition cursor-pointer self-start"
        >
          Create Room
        </button>
      </form>
    </div>
  );
}

export default AddRoom;
