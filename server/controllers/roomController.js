const Room = require("../models/Room");

const getRooms = async (req, res) => {
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Rooms fetched successfully",
        data: rooms
    });
};

const getRoom = async (req, res) => {
    const room = await Room.findById(req.params.id);

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

const createRoom = async (req, res) => {
    const { name, description, capacity, location, price, status } = req.body;

    const newRoom = await Room.create({
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

const updateRoom = async (req, res) => {
    const { name, description, capacity, location, price, status } = req.body;
    const updates = Object.fromEntries(
        Object.entries({ name, description, capacity, location, price, status })
            .filter(([, value]) => value !== undefined)
    );

    const room = await Room.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
    });

    if (!room) {
        return res.status(404).json({
            success: false,
            message: "Room not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "Room updated successfully",
        data: room
    });
};

const deleteRoom = async (req, res) => {
    const room = await Room.findByIdAndDelete(req.params.id);

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
