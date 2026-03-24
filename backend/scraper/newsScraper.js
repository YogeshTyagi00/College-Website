import puppeteer from "puppeteer";
import { UserNews } from "../models/news.model.js";

const DTU_HOME_URL = "https://www.dtu.ac.in";

// Tab selectors and their metadata
const TABS = [
    { label: "Latest News",     selector: "a[href*='latestnews'], li:contains('Latest News') a, .tab:contains('Latest News')", section: "latestnews" },
    { label: "Notices",         selector: "a[href*='notices'], li:contains('Notices') a, .tab:contains('Notices')",             section: "notices" },
    { label: "Jobs",            selector: "a[href*='jobs'], li:contains('Jobs') a, .tab:contains('Jobs')",                     section: "jobs" },
    { label: "Forthcoming Events", selector: "a[href*='events'], li:contains('Events') a, .tab:contains('Events')",            section: "events" },
    { label: "Ist Year Notices", selector: "a[href*='1st'], li:contains('Year') a, .tab:contains('Year')",                    section: "1styear" },
];

const categorize = (title, section) => {
    const t = title.toLowerCase();
    if (section === "jobs")    return "campusE";
    if (section === "1styear") return "academicE";
    if (section === "events")  return "eventE";
    if (t.includes("sport") || t.includes("tournament") || t.includes("athletic")) return "sportsE";
    if (t.includes("techfest") || t.includes("hackathon") || t.includes("engifest")) return "tech-festE";
    if (t.includes("exam") || t.includes("scholarship") || t.includes("fee") ||
        t.includes("admission") || t.includes("grade") || t.includes("attendance") ||
        t.includes("datesheet") || t.includes("date sheet") || t.includes("marksheet") ||
        t.includes("convocation") || t.includes("result") || t.includes("registration"))
        return "academicE";
    if (t.includes("seminar") || t.includes("workshop") || t.includes("conference") ||
        t.includes("cultural") || t.includes("fest"))
        return "eventE";
    return "campusE";
};

const extractDate = (text) => {
    const match = text.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (match) {
        const [, day, month, year] = match;
        return new Date(`${year}-${month}-${day}`);
    }
    return new Date();
};

export const scrapeAndSaveNews = async () => {
    console.log("[Scraper] Launching Puppeteer...");

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
    } catch (err) {
        console.error("[Scraper] Failed to launch browser:", err.message);
        return { saved: 0, skipped: 0, error: err.message };
    }

    const allItems = [];
    let saved = 0;
    let skipped = 0;

    try {
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        await page.goto(DTU_HOME_URL, { waitUntil: "networkidle2", timeout: 30000 });

        // Find all tab buttons by their visible text
        const tabTexts = ["Latest News", "Notices", "Jobs", "Forthcoming Events", "Ist Year Notices"];

        for (const tabText of tabTexts) {
            try {
                console.log(`[Scraper] Clicking tab: ${tabText}`);

                // Find and click the tab by its text content
                await page.evaluate((text) => {
                    const els = Array.from(document.querySelectorAll("a, li, div, span, td"));
                    const tab = els.find(el => el.textContent.trim() === text);
                    if (tab) tab.click();
                }, tabText);

                // Wait for content to update
                await new Promise(r => setTimeout(r, 1500));

                // Extract all h6 links visible on page after tab click
                const items = await page.evaluate(() => {
                    const results = [];
                    document.querySelectorAll("h6 a, h5 a").forEach(a => {
                        const title = a.textContent.replace(/\s+/g, " ").trim();
                        const href = a.href || "";
                        // Get nearby date text
                        const parent = a.closest("h6, h5, div, td, li");
                        const siblingText = parent ? parent.parentElement?.textContent || "" : "";
                        const dateMatch = siblingText.match(/(\d{2})\.(\d{2})\.(\d{4})/);
                        const dateStr = dateMatch ? dateMatch[0] : "";
                        if (title.length > 10) {
                            results.push({ title, href, dateStr });
                        }
                    });
                    return results;
                });

                // Determine section from tab text
                const section = tabText.includes("Job") ? "jobs"
                    : tabText.includes("Event") ? "events"
                    : tabText.includes("Year") ? "1styear"
                    : tabText.includes("Notice") ? "notices"
                    : "latestnews";

                items.forEach(item => {
                    if (!allItems.find(i => i.title === item.title)) {
                        allItems.push({ ...item, section });
                    }
                });

                console.log(`[Scraper] Tab "${tabText}" → ${items.length} items`);
            } catch (tabErr) {
                console.error(`[Scraper] Error on tab "${tabText}":`, tabErr.message);
            }
        }
    } catch (err) {
        console.error("[Scraper] Page error:", err.message);
    } finally {
        await browser.close();
    }

    console.log(`[Scraper] Total unique items: ${allItems.length}`);

    for (const item of allItems) {
        const exists = await UserNews.findOne({ title: item.title });
        if (exists) { skipped++; continue; }

        const category = categorize(item.title, item.section);
        const date = extractDate(item.dateStr);
        const excerpt = item.title.slice(0, 147) + (item.title.length > 147 ? "..." : "");

        try {
            await UserNews.create({
                title: item.title,
                content: item.href ? `Full notice: ${item.href}` : item.title,
                excerpt,
                category,
                publishedAt: date,
                tags: [item.section],
                featured: false,
            });
            saved++;
        } catch (err) {
            console.error(`[Scraper] Save failed: "${item.title}"`, err.message);
        }
    }

    console.log(`[Scraper] Done — saved: ${saved}, skipped: ${skipped}`);
    return { saved, skipped };
};
