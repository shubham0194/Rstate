import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function Room() {

  const { id } = useParams();

  const [room, setRoom] = useState(null);

  useEffect(() => {

    const getRoom = async () => {
      try {
        const response = await API.get(`/rooms/${id}`);

        console.log(response.data);

        setRoom(response.data.data);

      } catch (error) {
        console.log(error);
      }
    };

    getRoom();

  }, [id]);

  if (!room) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {room.name}
      </h1>

      <p>{room.description}</p>
      <p>Capacity: {room.capacity}</p>
    </div>
  );
}

export default Room;