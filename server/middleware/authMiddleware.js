const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const error = new Error("Not authenticated");
            error.statusCode = 401;
            return next(error);
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        error.statusCode = 401;
        error.message = "Invalid or expired token";
        next(error);
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        const error = new Error("Admin access required");
        error.statusCode = 403;
        return next(error);
    }

    next();
};

module.exports = {
    protect,
    adminOnly
};