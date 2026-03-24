import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    message: {
        type: String,
        trim: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created",
    },
}, { timestamps: true });

export const Donation = mongoose.model("Donation", donationSchema);
