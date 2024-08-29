#!/usr/bin/env bun
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
import { systemPrompt } from "./systemPrompt";}
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
  const currentDateString = new Date().toISOString().replace(/:/g, "-");
  const systemPromptMessage = {
    role: "system",
    content: systemPrompt
  };

  let chatHistory = [systemPromptMessage];

  while (true) {
    const query = (await new Promise((resolve) => {
      rl.question("Please enter your query: ", resolve);
    })) as string;

    chatHistory.push({ role: "user", content: query });

    const runner = openai.beta.chat.completions.runTools({
      model: "gpt-4o",
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
