const express = require("express");

const router = express.Router();

const { getRooms,
        createRoom,
        getRoom,
        updateRoom,
        deleteRoom } = require("../controllers/roomController"); 

const { protect,adminOnly } = require("../middleware/authMiddleware");

router.get("/", getRooms);

router.post("/", protect,adminOnly, createRoom);

router.get("/:id", protect, getRoom);

router.put("/:id", protect,adminOnly, updateRoom);

router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;