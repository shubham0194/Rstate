import { useEffect, useState } from "react";
import API from "../api/api";

function Rooms() {

    const [rooms, setRooms] = useState([]);

    useEffect(() => {

        const fetchRooms = async () => {

            try {
                const response = await API.get("/rooms");

                console.log(response.data);

                setRooms(response.data.data);

            } catch (error) {
                console.log(error);
            }

        };

        fetchRooms();

    }, []);

    return (
        <div>
            {rooms.map((room) => (
                <div key={room.id}>
                    <h2>{room.name}</h2>
                    <p>{room.description}</p>
                    <p>Capacity: {room.capacity}</p>
                    <br></br>
                </div>
            ))}
        </div>
    );
}

export default Rooms;