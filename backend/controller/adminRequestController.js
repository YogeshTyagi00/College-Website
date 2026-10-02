import { User } from "../models/user.model.js";

// POST /admin-request
// Logged-in user requests admin privileges
export const requestAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin' || user.role === 'superAdmin') {
            return res.status(400).json({ message: "You are already an admin" });
        }

        user.adminRequestStatus = 'pending';
        await user.save();

        res.status(200).json({ message: "Admin request submitted successfully" });

    } catch (error) {
        console.error("Error submitting admin request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /admin-request/all
// SuperAdmin fetches all users with a pending request
export const getAllRequests = async (req, res) => {
    try {
        const pendingRequests = await User.find(
            { adminRequestStatus: 'pending' },
            { userName: 1, adminRequestStatus: 1, updatedAt: 1 }
        ).sort({ updatedAt: -1 });

        res.status(200).json(pendingRequests);

    } catch (error) {
        console.error("Error fetching admin requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// PATCH /admin-request/:userId/review
// SuperAdmin approves or rejects a request
export const reviewRequest = async (req, res) => {
    const { userId } = req.params;
    const { action } = req.body; // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.adminRequestStatus !== 'pending') {
            return res.status(400).json({ message: "No pending request for this user" });
        }

        if (action === 'approve') {
            user.role = 'admin';
            user.adminRequestStatus = 'approved';
        } else {
            user.adminRequestStatus = 'rejected';
        }

        await user.save();

        res.status(200).json({
            message: `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
            user: { userName: user.userName, role: user.role, adminRequestStatus: user.adminRequestStatus }
        });

    } catch (error) {
        console.error("Error reviewing admin request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
