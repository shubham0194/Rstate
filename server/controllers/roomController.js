const rooms = [
    {
        id: 1,
        name: "Room 1",
        description: "This is room 1",
        capacity: 10,
        location: "Nairobi",
        price: 1200,
        status: "available"
    },
    {
        id: 2,
        name: "Room 2",
        description: "This is room 2",
        capacity: 20,
        location: "Kisumu",
        price: 1500,
        status: "available"
    },
    {
        id: 3,
        name: "Room 3",
        description: "This is room 3",
        capacity: 30,
        location: "Mombasa",
        price: 1800,
        status: "booked"
    }
];

const getRooms = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Rooms fetched successfully",
        data: rooms
    });
};

const getRoom = (req, res) => {
    const room = rooms.find(r => r.id === parseInt(req.params.id));
    if (!room) {
        return res.status(404).json({
            success: false,
            message: "Room not found"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Room fetched successfully",
        data: room
    });
};

const createRoom = (req, res) => {
    const { name, description, capacity, location, price, status } = req.body;
    const newRoom = {
        id: rooms.length + 1,
        name,
        description,
        capacity,
        location,
        price,
        status: status || "available"
    };
    rooms.push(newRoom);
    return res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: newRoom
    });
};

const updateRoom = (req, res) => {
    const { name, description, capacity, location, price, status } = req.body;
    const room = rooms.find(r => r.id === parseInt(req.params.id));
    if (!room) {
        return res.status(404).json({
            success: false,
            message: "Room not found"
        });
    }

    room.name = name ?? room.name;
    room.description = description ?? room.description;
    room.capacity = capacity ?? room.capacity;
    room.location = location ?? room.location;
    room.price = price ?? room.price;
    room.status = status ?? room.status;

    return res.status(200).json({
        success: true,
        message: "Room updated successfully",
        data: room
    });
};

const deleteRoom = (req, res) => {
    const room = rooms.find(r => r.id === parseInt(req.params.id));

    if (!room) {
        return res.status(404).json({
            success: false,
            message: "Room not found"
        });
    }

    const index = rooms.findIndex(r => r.id === parseInt(req.params.id));
    rooms.splice(index, 1);

    return res.status(200).json({
        success: true,
        message: "Room deleted successfully",
        data: room
    });
};

module.exports = {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom
};