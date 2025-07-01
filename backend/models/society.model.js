import mongoose from "mongoose";

const societySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fullDescription: {
        type: String,
    },
    category: {
        type: String,
        enum: ["cultural", "technical", "sports", "academic", "social","creative","business"],
        required: true
    },
    seats: {
        type: Number,
    },
    featured: {
        type: Boolean,
        default: false
    },
    registrationOpen: {
        type: Boolean,
        default: true
    },
    registrationDeadline: {
        type: Date,
    },
    registrationLink: {
        type: String,
    },
    location: {
        type: String,
    },
    contact: {
        whatsappLink: {
            type: String,
        },
        phone: {
            type: String,
        }
    },
    requirements: {
        type: String,
    },
    socialMedia: {
        discord: {
            type: String,
        },
        instagram: {
            type: String,
        },
        linkedin: {
            type: String,
        }
    }
},{timestamps: true});

export const UserSociety = mongoose.model("Society", societySchema);