import { UserNews } from "../models/news.model.js";
import { UserEvents } from "../models/events.model.js";
import { UserSociety } from "../models/society.model.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const createnews = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, featured } = req.body;

        const newsItem = new UserNews({
            title,
            content,
            excerpt,
            category,
            tags,
            featured
        });

        await newsItem.save();
        res.status(201).json({ message: "News item created successfully", newsItem });
    } catch (error) {
        console.error("Error creating news item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getnews = async (req, res) => {
    try {
        const newsItems = await UserNews.find().sort({ createdAt: -1 });
        res.status(200).json(newsItems);
    } catch (error) {
        console.error("Error fetching news items:", error);     
        res.status(500).json({ message: "Internal server error" });
    }
}    
export const createevents = async (req, res) => {
    try {
        const { title, description, date, time, location, category, registrationLink, registrationDeadline, organizer } = req.body;

        const eventItem = new UserEvents({
            title,
            description,
            date,
            time,
            location,
            category,
            registrationLink,
            registrationDeadline,
            organizer
        });

        await eventItem.save();
        res.status(201).json({ message: "Event created successfully", eventItem });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getevents = async (req, res) => {
    try {
        const eventItems = await UserEvents.find().sort({ createdAt: -1 });
        res.status(200).json(eventItems);
    } catch (error) {
        console.error("Error fetching event items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const createsociety = async (req, res) => {
    try {
        const { name, description, fullDescription, category, seats, featured, registrationOpen, registrationDeadline, registrationLink, location, contact,requirements,socialMedia} = req.body;

        const societyItem = new UserSociety({
            name,
            description,
            fullDescription,
            category,
            seats,
            featured,
            registrationOpen,
            registrationDeadline,
            registrationLink,
            location,
            contact,
            requirements,
            socialMedia
        });

        await societyItem.save();
        res.status(201).json({ message: "Society created successfully", societyItem });
    } catch (error) {
        console.error("Error creating society:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getsociety = async (req, res) => {
    try {
        const societyItems = await UserSociety.find().sort({ createdAt: -1 });
        res.status(200).json(societyItems);
    } catch (error) {
        console.error("Error fetching society items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signup = async (req, res) => {
    const{name,rollNo} = req.body;
    try {
        if (!name || !rollNo) {
            return res.status(400).json({ message: "Name and roll number are required" });
        }

        const userAlreadyExists = await User.findOne({ rollNo });
        if (userAlreadyExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            name,
            rollNo
        });

        await newUser.save();

        generateTokenAndSetCookie(res,newUser._id);
       
        res.status(201).json({ message: "User registered successfully", user: { name, rollNo } });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}   
export const login = async (req, res) => {
    const { rollNo } = req.body;
    try {
        if (!rollNo) {
            return res.status(400).json({ message: "Roll number is required" });
        }

        const user = await User.findOne({ rollNo });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        generateTokenAndSetCookie(res, user._id);

        await user.save();
        
        res.status(200).json({ message: "Login successful", user: { name: user.name, rollNo: user.rollNo } });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('name rollNo');
        if (!user) {    
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ isAuthenticated: true, user: { name: user.name, rollNo: user.rollNo } });
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}