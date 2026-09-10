const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        capacity: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available"
        }
    },
    {
        timestamps: true
    }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
