const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    capacity: {
        type: Number,
        required: true,
        min: 1
    },

    location: {
        locality: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        }
    },

    images: {
        type: [String],
        default: []
    },

    isIndependent: {
        type: Boolean,
        default: false
    },

    bhkType: {
        type: String,
        enum: ["1RK", "2RK", "1BHK", "2BHK", "3BHK", "custom"],
        default: "custom"
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["available", "rented", "sold"],
        default: "available"
    }
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
