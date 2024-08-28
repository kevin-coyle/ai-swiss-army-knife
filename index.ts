import fs from "fs";
import OpenAI from "openai";
import readline from "readline";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import openaiTokenCounter from "openai-gpt-token-counter";
import {
  writeCode,
  readFile,
  listDirectory,
  runCommand,
  googleSearch,
  viewWebsite,
} from "./functions";
import os from "os"; // Import the os module

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

// Function to detect the OS
function detectOS() {
  return os.platform();
}

async function main() {
  const operatingSystem = detectOS();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const currentDateString = new Date().toISOString().replace(/:/g, "-");
  const systemPrompt = {
    role: "system",
    content: `
    You are a experienced web developer who will have be given access to a linux or mac based system that you will use to write components with..
    You will be given an instruction from the user and you are to do what they ask.
    The user is running a ${operatingSystem} based system.
    Always write the complete code solutions. NEVER EVER write partial code solutions.
    If you do a code change make sure you do a git commit afterwards.
    If you don't know how to do something do a google search or ask the user for some more information.
    The current date is ${currentDateString}.
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
    const tokenCount = openaiTokenCounter.chat(chatHistory, "gpt-4o");
    console.log("Token Count: ", tokenCount);
    chatHistory.push({ role: "assistant", content: aiReply });
  }
}

main().catch(console.error);
