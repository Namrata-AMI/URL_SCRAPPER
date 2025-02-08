const axios = require("axios");
const cheerio = require("cheerio");


async function scrapeMetadata(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        console.log(data);

        return {
            title: $("title").text(),
            description: $('meta[name="description"]').attr("content") || "N/A",
            keywords: $('meta[name="keywords"]').attr("content") || "N/A"
        };
    } catch (err) {
        console.error(`Error scraping ${url}:`, err.message);
        return { title: "Error", description: "Failed to scrape", keywords: "" };
    }
}

module.exports = { scrapeMetadata };
