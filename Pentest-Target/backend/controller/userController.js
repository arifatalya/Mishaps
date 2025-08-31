import {generateSessionId, validateSession, deleteSession} from '../utils/sessionUtils.js';
import {createJwt, verifyJwt} from '../utils/utils.js';
import userModel from '../model/userModel.js';
import argon2 from 'argon2';
import validator from 'validator';
import dotenv from 'dotenv';

dotenv.config();

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({ success: false, error: "Username, email, and password are required." });
    }
    if (!validator.isEmail(email)) {
        return res.json({ success: false, error: "Please enter a valid email address." });
    }
    if (password.length < 8) {
        return res.json({ success: false, error: "Password must be at least 8 characters." });
    }

    try {
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, error: "User already exists." });
        }

        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });

        const newUser = new userModel({ username, email, password: hashedPassword });
        const user = await newUser.save();

        const token = createJwt(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during registration:", error);
        res.json({ success: false, message: "Error during registration." });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, error: "Email and password are required." });
    }
    if (!validator.isEmail(email)) {
        return res.json({ success: false, error: "Please enter a valid email address." });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist." });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials." });
        }

        const existingSession = await validateSession(user._id, req.cookies.sessionId);
        if (existingSession) {
            return res.json({ success: false, message: "User already logged in elsewhere." });
        }

        const sessionId = await generateSessionId(user._id);
        const token = createJwt(user._id);

        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.json({ success: false, message: "Error during login." });
    }
};

const deleteUser = async (req, res) => {
    const { userId, password } = req.body;
    const sessionId = req.cookies.sessionId;

    if (!userId || !sessionId || !password) {
        return res.status(401).json({ success: false, message: "Unauthorized or missing fields." });
    }

    try {
        const session = await validateSession(userId, sessionId);
        if (!session) {
            return res.status(401).json({ success: false, message: "Session expired or invalid." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist." });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }

        await userModel.deleteOne({ _id: user._id });
        await deleteSession(userId);

        res.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ success: false, message: "Error deleting user." });
    }
};

const updateUser = async (req, res) => {
    const userId = req.body.userId;
    const sessionId = req.cookies.sessionId;

    if (!userId || !sessionId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const session = await validateSession(userId, sessionId);
        if (!session) {
            return res.status(401).json({ success: false, message: "Session expired or invalid." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist." });
        }

        if (req.body.username) {
            user.username = req.body.username;
        }

        if (req.body.email) {
            if (!validator.isEmail(req.body.email)) {
                return res.status(400).json({ success: false, message: "Invalid email address." });
            }
            user.email = req.body.email;
        }

        if (req.body.password) {
            if (req.body.password.length < 8) {
                return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
            }
            user.password = await argon2.hash(req.body.password);
        }

        const updatedUser = await user.save();
        res.json({
            success: true,
            message: "User updated successfully.",
            user: {
                userId: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
            },
        });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ success: false, message: "Error updating user." });
    }
};

const logoutUser = async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ success: false, message: "No session found." });
    }

    try {
        const userId = req.body.userId || req.query.userId;
        await deleteSession(userId);

        res.clearCookie('sessionId');
        res.json({ success: true, message: "Logged out successfully." });
    } catch (error) {
        console.error("Error during logout:", error.message);
        res.status(500).json({ success: false, message: "Error during logout." });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({
            success: true,
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error fetching user details:", error.message);
        res.status(500).json({ success: false, message: "Error fetching user details." });
    }
};

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const sessionId = req.cookies.sessionId;

    if (!token || !sessionId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = verifyJwt(token);
        const session = await validateSession(decoded.id, sessionId);

        if (!session) {
            return res.status(401).json({ success: false, message: "Session expired or invalid." });
        }

        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Authorization error:", error.message);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

const validateSessionRoute = async (req, res) => {
    const sessionId = req.cookies.sessionId;
    const token = req.headers.authorization?.split(" ")[1];

    if (!sessionId || !token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = verifyJwt(token);
        const session = await validateSession(decoded.id, sessionId);

        if (!session) {
            return res.status(401).json({ success: false, message: "Session expired or invalid." });
        }

        res.json({ success: true, message: "Session is valid." });
    } catch (error) {
        console.error("Session validation error:", error.message);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export {
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    logoutUser,
    getUserDetails,
    authMiddleware,
    validateSessionRoute
};
