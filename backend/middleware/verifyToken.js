import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.userId = decoded.userId;

        // Fetch fresh role from DB so role changes (e.g. admin promotion)
        // are reflected immediately without requiring re-login
        const dbUser = await User.findById(decoded.userId).select('role');

        if (!dbUser) {
            return res.status(401).json({ message: "User not found" });
        }

        req.role = dbUser.role;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ message: "Forbidden access" });
    }
};