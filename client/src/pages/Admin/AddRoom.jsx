import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

function AddRoom() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [roomData, setRoomData] = useState({
    name: "",
    location: {
      locality: "",
      city: "",
      state: "",
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
      const payload = {
        name: roomData.name,
        location: roomData.location,
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
    <div>
      <h1 className="text-3xl font-bold">Create Room</h1>

      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}

      <form onSubmit={createRoom} className="mt-4">
        <input
          type="text"
          name="name"
          placeholder="Room title"
          value={roomData.name}
          onChange={handleChange}
        />

        <fieldset>
          <legend>Location</legend>
          <input
            type="text"
            name="locality"
            placeholder="Locality"
            value={roomData.location.locality}
            onChange={handleLocationChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={roomData.location.city}
            onChange={handleLocationChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={roomData.location.state}
            onChange={handleLocationChange}
          />
        </fieldset>

        <select
          name="isIndependent"
          value={String(roomData.isIndependent)}
          onChange={handleChange}
        >
          <option value="false">Not independent</option>
          <option value="true">Independent</option>
        </select>

        <select name="bhkType" value={roomData.bhkType} onChange={handleChange}>
          <option value="1RK">1 RK</option>
          <option value="2RK">2 RK</option>
          <option value="1BHK">1 BHK</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
          <option value="custom">Custom</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={roomData.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={roomData.capacity}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={roomData.description}
          onChange={handleChange}
        />

        <fieldset style={{ marginTop: "10px", marginBottom: "10px" }}>
          <legend>Images (URLs)</legend>
          {roomData.images.map((url, index) => (
            <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <input
                type="text"
                placeholder="Image URL (e.g. https://example.com/image.jpg)"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                style={{ flex: 1 }}
              />
              {roomData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  style={{ padding: "4px 8px" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            style={{ padding: "4px 8px", cursor: "pointer" }}
          >
            + Add Another Image URL
          </button>
        </fieldset>

        <button type="submit">Create Room</button>
      </form>
    </div>
  );
}

export default AddRoom;
