import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/api";

function EditRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [roomData, setRoomData] = useState({
    name: "",
    location: "",
    price: "",
    capacity: "",
    description: "",
    status: "available",
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await API.get(`/rooms/${id}`);
        const room = response.data.data;

        setRoomData({
          name: room.name || "",
          location: room.location || "",
          price: room.price || "",
          capacity: room.capacity || "",
          description: room.description || "",
          status: room.status || "available",
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
      [name]: value,
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

        <button type="submit">Update Room</button>
      </form>
    </div>
  );
}

export default EditRoom;
