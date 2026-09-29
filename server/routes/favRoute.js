const express = require("express");
const router = express.Router();

const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:roomId", protect, addFavorite);
router.get("/", protect, getFavorites);
router.delete("/:roomId", protect, removeFavorite);

module.exports = router;