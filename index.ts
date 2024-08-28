#!/usr/bin/env bun
import fs from "fs";
import OpenAI from "openai";
import readline from "readline";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as path from "path";
import SerpApi from "google-search-results-nodejs";
import puppeteer from "puppeteer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type options = {
  code: string;
  fileName: string;
};

const GetWriteFileParameters = z.object({
  code: z.string(),
  fileName: z.string(),
});

const GetReadFileParameters = z.object({
  fileName: z.string(),
});

const GetStoryParameters = z.object({
  componentFileName: z.string(),
});

const GetDirectoryParameters = z.object({
  directory: z.string(),
});

const GetRunCommandParameters = z.object({
  command: z.string(),
});

const GetGoogleSearchParameters = z.object({
  query: z.string(),
});

const GetViewWebsiteParameters = z.object({
  url: z.string().url(),
});

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const systemPrompt = {
    role: "system",
    content: `
    You are a experienced web developer who will have be given access to a linux or mac based system that you will use to write components with..
    You will be given an instruction from the user and you are to do what they ask.
    You are able to navigate the internet. If the user asks you to go to a site and the information is not on that page then look for navigation links on that page and then go to those also. Give up after 3 tries.
    `,
  };

  let chatHistory = [systemPrompt];

  while (true) {
    const query = (await new Promise((resolve) => {
      rl.question("Please enter your query: ", resolve);
    })) as string;

    chatHistory.push({ role: "user", content: query });

    const runner = openai.beta.chat.completions.runTools({
      model: "gpt-4o-mini",
      messages: chatHistory,
      tools: [
        {
          type: "function",
          function: {
            function: writeCode,
            parameters: zodToJsonSchema(GetWriteFileParameters),
          },
        },
        {
          type: "function",
          function: {
            function: readFile,
            parameters: zodToJsonSchema(GetReadFileParameters),
          },
        },
        {
          type: "function",
          function: {
            function: listDirectory,
            parameters: zodToJsonSchema(GetDirectoryParameters),
          },
        },
        {
          type: "function",
          function: {
            function: runCommand,
            parameters: zodToJsonSchema(GetRunCommandParameters),
          },
        },
        {
          type: "function",
          function: {
            function: googleSearch,
            parameters: zodToJsonSchema(GetGoogleSearchParameters),
          },
        },
        {
          type: "function",
          function: {
            function: viewWebsite,
            parameters: zodToJsonSchema(GetViewWebsiteParameters),
          },
        },
      ],
    });

    const aiReply = (await runner.finalContent()) as string;
    console.log(aiReply);
    chatHistory.push({ role: "assistant", content: aiReply });
  }
}

main().catch(console.error);

function writeCode(options: string) {
  const { code, fileName } = JSON.parse(options);
  console.log("Writing Code...");
  console.log(
    `File will be written to: ${path.resolve(process.cwd(), fileName)}`,
  );
  // Write the code to a file
  try {
    fs.writeFileSync(fileName, code);
    console.log(`Successfully wrote to ${fileName}`);
    return `Successfully wrote to ${fileName}`;
  } catch (error) {
    console.error(`Error writing to ${fileName}: ${error.message}`);
    return `Error writing to ${fileName}: ${error.message}`;
  }
}

function readFile(options: string) {
  const { fileName } = JSON.parse(options);
  console.log("Reading File..." + fileName);
  const filePath = path.resolve(process.cwd(), fileName);
  // Check if file exists if it doesn't then return a string saying file does not exist'
  if (!fs.existsSync(filePath)) {
    return "File does not exist or is not readable";
  }
  return fs.readFileSync(filePath, "utf8");
}
function listDirectory(options: string) {
  console.log("Listing Directory" + options);
  const { directory } = JSON.parse(options);
  try {
    const files = fs.readdirSync(directory);
    return files;
  } catch (error) {
    return `Error: ${error.message}`;
  }
  return files;
}

async function runCommand(options: string) {
  const { command } = JSON.parse(options);
  console.log("Running Command..." + command);
  const util = require("util");
  const exec = util.promisify(require("child_process").exec);
  try {
    const { stdout, stderr } = await exec(command);
    return { stdout, stderr };
  } catch (error) {
    return { error: error.message, stderr: error.stderr };
  }
}

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
// Add this to the tools array in the main function
