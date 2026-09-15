const Room = require("../models/Roomdb");

const getRooms = async (req, res) => {
    try {
        const {
            search,
            location,
            city,
            locality,
            state,
            status,
            minPrice,
            maxPrice,
            capacity,
            bhkType,
            isIndependent,
            sort
        } = req.query;

        const filter = {};

        // Searching across room name, description, and location text
        if (search) {
            const regex = new RegExp(search.trim(), "i");
            filter.$or = [
                { name: regex },
                { description: regex },
                { "location.locality": regex },
                { "location.city": regex },
                { "location.state": regex }
            ];
        }

        // Specific location filters
        if (city) {
            filter["location.city"] = new RegExp(city.trim(), "i");
        }
        if (locality) {
            filter["location.locality"] = new RegExp(locality.trim(), "i");
        }
        if (state) {
            filter["location.state"] = new RegExp(state.trim(), "i");
        }
        if (location && typeof location === "string") {
            const locRegex = new RegExp(location.trim(), "i");
            const locOr = [
                { "location.locality": locRegex },
                { "location.city": locRegex },
                { "location.state": locRegex }
            ];
            if (filter.$or) {
                filter.$and = [{ $or: filter.$or }, { $or: locOr }];
                delete filter.$or;
            } else {
                filter.$or = locOr;
            }
        }

        if (status) {
            filter.status = status;
        }

        if (bhkType) {
            filter.bhkType = bhkType;
        }

        if (isIndependent !== undefined && isIndependent !== "") {
            filter.isIndependent = isIndependent === "true" || isIndependent === true;
        }

        if (capacity) {
            filter.capacity = { $gte: Number(capacity) };
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Sorting
        let sortOption = { _id: -1 }; // default newest first
        if (sort) {
            switch (sort) {
                case "price-asc":
                    sortOption = { price: 1 };
                    break;
                case "price-desc":
                    sortOption = { price: -1 };
                    break;
                case "capacity-asc":
                    sortOption = { capacity: 1 };
                    break;
                case "capacity-desc":
                    sortOption = { capacity: -1 };
                    break;
                case "name-asc":
                    sortOption = { name: 1 };
                    break;
                case "name-desc":
                    sortOption = { name: -1 };
                    break;
                case "newest":
                    sortOption = { _id: -1 };
                    break;
                case "oldest":
                    sortOption = { _id: 1 };
                    break;
                default:
                    sortOption = { _id: -1 };
            }
        }

        const rooms = await Room.find(filter).sort(sortOption);

        res.status(200).json({
            success: true,
            message: "Rooms fetched successfully",
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch rooms"
        });
    }
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
    const { name, description, capacity, location, price, status, isIndependent, bhkType, images } = req.body;

    const newRoom = await Room.create({
        name,
        description,
        capacity,
        location,
        price,
        status: status || "available",
        isIndependent,
        bhkType,
        images: Array.isArray(images) ? images : (images ? [images] : [])
    });

    return res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: newRoom
    });
};

const updateRoom = async (req, res) => {
    const { name, description, capacity, location, price, status, isIndependent, bhkType, images } = req.body;
    const updates = Object.fromEntries(
        Object.entries({ name, description, capacity, location, price, status, isIndependent, bhkType, images })
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
