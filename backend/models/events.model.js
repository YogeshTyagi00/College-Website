import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    date:{
        type: Date,
    },
    time:{
        type: String,
    },
    location:{
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ["workshop", "seminar", "competition", "conference","technical"],
        required: true,
    },
 /*    imageUrl:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop", */
    registrationLink: {
        type: String,
        required: true,
        trim: true,
    },
    registrationDeadline: {
        type: Date,
    },
    organizer: {
        type: String,
        required: true,
        trim: true,
    },
},{timestamps: true});

export const UserEvents = mongoose.model("Events", eventSchema);