const Favorite = require("../models/fav");

const getFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id })
            .populate("room")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Favorites fetched successfully",
            data: favorites.filter((favorite) => favorite.room),
        });
    } catch (error) {
        next(error);
    }
};

const removeFavorite = async (req, res, next) => {
    try{
        const { roomId } = req.params;
        const favorite = await Favorite.findOneAndDelete({ user: req.user.id, room: roomId });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: "Favorite not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Room removed from favorites",
        });
    }
    catch (error){
        next(error);
    }
}
const addFavorite = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        const existing = await Favorite.findOne({ user: req.user.id, room: roomId });
        if (existing) {
            return res.status(200).json({
                success: true,
                message: "Room is already in your favorites",
                data: existing,
            });
        }

        const favorite = await Favorite.create({
            user: req.user.id,
            room: roomId,
        });

        res.status(201).json({
            success: true,
            message: "Room added to favorites",
            data: favorite,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
};