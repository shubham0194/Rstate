
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const getUsers = (req, res) => {
    res.send("Get all users");
};

const getUser = (req, res) => {
    res.send(`Get user ${req.params.id}`);
};

const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 400;
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};


const deleteUser = (req, res) => {
    res.send(`Delete user ${req.params.id}`);
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error);
        }
        
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        
        if (!isPasswordCorrect) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            return next(error);
        }
        
        const token = jwt.sign(
            { id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
        
    } catch (error) {
        next(error);
    }
};

const googleLogin = async (req, res, next) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            const error = new Error("Google credential is required");
            error.statusCode = 400;
            return next(error);
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            sub: googleId,
            name,
            email
        } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: `google_${googleId}`,
                role: "user"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Google login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    loginUser,
    googleLogin
};