const Room = require("../models/Room");

const getRooms = (req, res) => {

    const rooms = Room.find();
    
    res.status(200).json({
        success: true,
        message: "Rooms fetched successfully",
        data: rooms
    });
};

const getRoom = (req, res) => {
    const room = Room.findById(req.params.id);
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
    const newRoom = new Room({
        name,
        description,
        capacity,
        location,
        price,
        status: status || "available"
    });
    return res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: newRoom
    });
};

const updateRoom = (req, res) => {
    const { name, description, capacity, location, price, status } = req.body;
    const room = Room.findById(req.params.id);
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
    const room = Room.findById(req.params.id);

    if (!room) {
        return res.status(404).json({
            success: false,
            message: "Room not found"
        });
    }

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