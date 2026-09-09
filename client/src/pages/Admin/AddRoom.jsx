import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

function AddRoom() {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    name: "",
    location: "",
    price: "",
    capacity: "",
    description: "",
    status: "available",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createRoom = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: roomData.name,
        location: roomData.location,
        price: Number(roomData.price),
        capacity: Number(roomData.capacity),
        description: roomData.description,
        status: "available",
      };

      const response = await API.post("/rooms", payload);
      console.log(response.data);

      setRoomData({
        name: "",
        location: "",
        price: "",
        capacity: "",
        description: "",
        status: "available",
      });

      navigate("/admin/rooms");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Create Room</h1>

      <form onSubmit={createRoom}>
        <input
          type="text"
          name="name"
          placeholder="Room title"
          value={roomData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={roomData.location}
          onChange={handleChange}
        />

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

        <button type="submit">Create Room</button>
      </form>
    </div>
  );
}

export default AddRoom;