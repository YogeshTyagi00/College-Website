import { scrapeAndSaveNews } from "../scraper/newsScraper.js";

export const triggerNewsScrape = async (req, res) => {
    try {
        const result = await scrapeAndSaveNews();
        res.status(200).json({
            message: "Scrape completed",
            ...result,
        });
    } catch (error) {
        console.error("Error triggering scrape:", error);
        res.status(500).json({ message: "Scrape failed", error: error.message });
    }
};
