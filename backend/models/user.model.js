import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum:['user','admin','superAdmin'],
        default:'user'
    },
    adminRequestStatus:{
        type: String,
        enum:['none', 'pending', 'approved', 'rejected'],
        default: 'none'
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);