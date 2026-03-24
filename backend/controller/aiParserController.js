import axios from "axios";
import { UserEvents } from "../models/events.model.js";
import { UserSociety } from "../models/society.model.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export const parseAndSaveEvent = async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "Text is required" });

  try {
    const { data } = await axios.post(`${AI_SERVICE_URL}/parse/event`, { text });

    const event = new UserEvents({
      title: data.title,
      description: data.description,
      date: data.date || undefined,
      time: data.time || undefined,
      location: data.location || "DTU Campus",
      category: data.category,
      registrationLink: data.registrationLink || "#",
      registrationDeadline: data.registrationDeadline || undefined,
      organizer: data.organizer || "DTU",
      featured: data.featured ?? false,
    });

    await event.save();
    res.status(201).json({ message: "Event parsed and saved", event });
  } catch (error) {
    console.error("AI event parse error:", error?.response?.data || error.message);
    res.status(500).json({ message: error?.response?.data?.detail || "Failed to parse event" });
  }
};

export const parseAndSaveSociety = async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "Text is required" });

  try {
    const { data } = await axios.post(`${AI_SERVICE_URL}/parse/society`, { text });

    const society = new UserSociety({
      name: data.name,
      description: data.description,
      fullDescription: data.fullDescription || undefined,
      category: data.category,
      seats: data.seats || undefined,
      featured: data.featured ?? false,
      registrationOpen: data.registrationOpen ?? true,
      registrationDeadline: data.registrationDeadline || undefined,
      registrationLink: data.registrationLink || undefined,
      location: data.location || undefined,
      contact: data.contact || undefined,
      requirements: data.requirements || undefined,
      socialMedia: data.socialMedia || undefined,
    });

    await society.save();
    res.status(201).json({ message: "Society parsed and saved", society });
  } catch (error) {
    console.error("AI society parse error:", error?.response?.data || error.message);
    res.status(500).json({ message: error?.response?.data?.detail || "Failed to parse society" });
  }
};
