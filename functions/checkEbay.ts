import viewWebsite from "./viewWebsite";
async function checkEbay(options: string) {
    const { item } = JSON.parse(options);
    // The url structure for ebay searches is https://www.ebay.co.uk/sch/i.html?_nkw=doctor+who+1965+annual&_sacat=0

    const query = item.split(" ").join("+");
    const url = `https://www.ebay.co.uk/sch/i.html?_nkw=${query}&_sacat=0`;

    const { title, content } = await viewWebsite(JSON.stringify({ url }));

    return content;
}

export default checkEbay;
