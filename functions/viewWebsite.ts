import puppeteer from "puppeteer";
import TurndownService from "turndown";
async function viewWebsite(options: string) {
    const { url } = JSON.parse(options);
    console.log(`Viewing website: ${url}`);

    try {
        const browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0" });

        const title = await page.title();
        let content = await page.evaluate(() => {
            const mainElement = document.querySelector("main");
            if (mainElement) {
                return mainElement.outerHTML;
            }
            const bodyElement = document.querySelector("body");
            return bodyElement ? bodyElement.outerHTML : "";
        });

        // Clean up the content
        const cleanContent = (html: string): string => {
            // Extract title
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const extractedTitle = titleMatch ? titleMatch[1] : "";

            // Remove head section
            html = html.replace(/<head>[\s\S]*?<\/head>/i, "");

            // Remove script tags
            html = html.replace(
                /<(script|style)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi,
                "",
            );

            // Remove all HTML tags
            html = html.replace(/<[^>]*>/g, "");

            // Trim whitespace and normalize spaces
            html = html.trim().replace(/\s+/g, " ");

            return html;
        };

        content = cleanContent(content);
        const turndownService = new TurndownService();
        const markdownContent = turndownService.turndown(content);
        await browser.close();
        return {
            title,
            content: markdownContent,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            return `Error viewing website: ${error.message}`;
        }
        return "An unknown error occurred while viewing the website";
    }
}

export default viewWebsite;
