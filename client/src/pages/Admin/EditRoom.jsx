import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";

function EditRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await API.get(`/rooms/${id}`);
        const room = response.data.data;
        const location = typeof room.location === "string"
          ? { locality: room.location, city: "", state: "" }
          : room.location || { locality: "", city: "", state: "" };

        const roomImages = Array.isArray(room.images) && room.images.length > 0
          ? room.images
          : [""];

        setRoomData({
          name: room.name || "",
          location,
          isIndependent: room.isIndependent || false,
          bhkType: room.bhkType || "custom",
          price: room.price || "",
          capacity: room.capacity || "",
          description: room.description || "",
          status: room.status || "available",
          images: roomImages,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (id) fetchRoom();
  }, [id]);

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

  const updateRoom = async (e) => {
    e.preventDefault();

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

      const response = await API.put(`/rooms/${id}`, payload);
      console.log(response.data);

      navigate("/admin/rooms");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Edit Room Page</h1>
      <form onSubmit={updateRoom} method="PUT">
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

        <button type="submit">Update Room</button>
      </form>
    </div>
  );
}

export default EditRoom;
