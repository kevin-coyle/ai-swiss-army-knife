import puppeteer from "puppeteer";

async function viewWebsite(options: string) {
  const { url } = JSON.parse(options);
  console.log(`Viewing website: ${url}`);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const title = await page.title();
    const content = await page.content();

    await browser.close();
    console.log(content);
    return {
      title,
      content: content.substring(0, 1000), // Limiting content to first 1000 characters
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
