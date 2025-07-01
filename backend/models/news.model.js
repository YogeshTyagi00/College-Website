import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    excerpt:{
        type: String,
        required: true,
        maxlength: 150
    },
    category: {
        type: String,
        enum: ["tech-festE", "sportsE", "eventE", "academicE","campusE"],
        required: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
/*     imageUrl:{
        
    } */
    tags: [],
    featured: {
        type: Boolean,
        default: false
    },
},{timestamps: true});

export const UserNews = mongoose.model("News", newsSchema);