import { UserNews } from "../models/news.model.js";
import { UserEvents } from "../models/events.model.js";
import { UserSociety } from "../models/society.model.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import bcryptjs from "bcryptjs";

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
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
        const skip  = (page - 1) * limit;

        const { search, category } = req.query;
        const filter = {};
        
        if (search?.trim()) {
            filter.$text = { $search: search.trim() };
        }
        if (category && category !== 'all') {
            filter.category = category;
        }

        const sortBy = search?.trim()
            ? { score: { $meta: 'textScore' }, publishedAt: -1 }
            : { publishedAt: -1 };

        const [newsItems, totalCount] = await Promise.all([
            UserNews.find(filter).sort(sortBy).skip(skip).limit(limit),
            UserNews.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            data: newsItems,
            currentPage: page,
            totalPages,
            totalCount,
            limit
        });
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
        const page = Math.max(1,parseInt(req.query.page) || 1);
        const limit =  Math.min(50,Math.max(1,parseInt(req.query.limit) || 9));
        const skip = (page-1)*limit;

        const {search,category,featured} = req.query;
        const filter = {};

        if(search?.trim()){
            filter.$text = {$search : search.trim()};
        }
        if (category && category !== 'all') {
            filter.category = category;
        }
        if (featured === 'true') {
            filter.featured = true;
        }
        
        const sortBy = search?.trim()
            ? { score: { $meta: 'textScore' }, createdAt: -1 }
            : { createdAt: -1 };
        const projection = search?.trim()
            ? { score: { $meta: 'textScore' } }
            : {};

        const [eventItems, totalCount] = await Promise.all([
            UserEvents.find(filter, projection).sort(sortBy).skip(skip).limit(limit),
            UserEvents.countDocuments(filter)
        ]);

        res.status(200).json({
            data: eventItems,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            limit,
        });

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
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
        const skip = (page - 1) * limit;

        const {search,category,registrationOpen } = req.query;
        const filter = {};

        if(search?.trim()){
            filter.$text = {$search : search.trim()};
        }
        if (category && category !== 'all') {
            filter.category = category;
        }
        if (registrationOpen  === 'true') {
            filter.registrationOpen  = true;
        }
        
        const sortBy = search?.trim()
            ? { score: { $meta: 'textScore' }, createdAt: -1 }
            : { createdAt: -1 };
        const projection = search?.trim()
            ? { score: { $meta: 'textScore' } }
            : {};

        const [societyItems, totalCount] = await Promise.all([
            UserSociety.find(filter, projection).sort(sortBy).skip(skip).limit(limit),
            UserSociety.countDocuments(filter)
        ]);

        res.status(200).json({
            data: societyItems,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            limit,
        });
    } catch (error) {
        console.error("Error fetching society items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signup = async (req, res) => {
    const{userName,password} = req.body;
    try {
        if (!userName || !password) {
            return res.status(400).json({ message: "userName and password are required" });
        }

        const userAlreadyExists = await User.findOne({ userName });
        if (userAlreadyExists) {
            return res.status(400).json({ message: "UserName already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            userName: userName.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();

        generateTokenAndSetCookie(res, newUser._id,newUser.role);

        res.status(201).json({ message: "User registered successfully", user: { userName, role: newUser.role, adminRequestStatus: newUser.adminRequestStatus } });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}   
export const login = async (req, res) => {
    const { userName, password } = req.body;
    try {
        if (!userName || !password) {
            return res.status(400).json({ message: "userName and password are required" });
        }

        const user = await User.findOne({ userName: userName.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id,user.role);

        res.status(200).json({ message: "Login successful", user: { userName: user.userName, role: user.role, adminRequestStatus: user.adminRequestStatus } });

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
        const user = await User.findById(req.userId).select('userName role adminRequestStatus');
        if (!user) {    
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ isAuthenticated: true, user: { userName: user.userName, role: user.role, adminRequestStatus : user.adminRequestStatus } });
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}