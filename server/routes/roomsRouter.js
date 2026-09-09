const express = require("express");

const router = express.Router();

const { getRooms,
        createRoom,
        getRoom,
        updateRoom,
        deleteRoom } = require("../controllers/roomController"); 

router.get("/", getRooms);

router.post("/", createRoom);

router.get("/:id", getRoom);

router.put("/:id", updateRoom);

router.delete("/:id", deleteRoom);

module.exports = router;