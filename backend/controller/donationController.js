import Razorpay from "razorpay";
import crypto from "crypto";
import { Donation } from "../models/donation.model.js";

export const createOrder = async (req, res) => {
    const { amount, name, email, message } = req.body;

    if (!amount || !name) {
        return res.status(400).json({ message: "Amount and name are required" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(503).json({ message: "Payment gateway not configured yet" });
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const options = {
            amount: amount * 100, // Razorpay expects paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        const donation = new Donation({
            name,
            email,
            amount,
            message,
            razorpayOrderId: order.id,
            status: "created",
        });

        await donation.save();

        res.status(201).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            donationId: donation._id,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    try {
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const donation = await Donation.findOneAndUpdate(
            { razorpayOrderId },
            { razorpayPaymentId, razorpaySignature, status: "paid" },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: "Donation record not found" });
        }

        res.status(200).json({ message: "Payment verified successfully", donation });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: "paid" }).sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
