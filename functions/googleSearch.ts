import SerpApi from "google-search-results-nodejs";

async function googleSearch(query: string) {
  const search = new SerpApi.GoogleSearch(process.env.SERPAPI_API_KEY);
  console.log(`Searching for: ${query}`);

  try {
    const result = await new Promise<any>((resolve, reject) => {
      search.json(
        {
          q: query,
          location: "United States",
        },
        (result: any) => {
          if (result.error) {
            reject(result.error);
          } else {
            resolve(result);
          }
        },
      );
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return `Error performing Google search: ${error.message}`;
    }
    return "An unknown error occurred during the Google search";
  }
}

export default googleSearch;
