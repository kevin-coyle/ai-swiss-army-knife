#!/usr/bin/env bun
import fs from "fs";
import OpenAI from "openai";
import readline from "readline";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as path from "path";

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

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const customElementsfile = fs.readFileSync("custom-elements.json", "utf8");
  const storiesFile = fs.readFileSync("Rich-table.stories.ts", "utf8");
  const dataFile = fs.readFileSync("data.ts", "utf8");
  const systemPrompt = {
    role: "system",
    content: `
    You are a experienced web developer who will have be given access to a linux or mac based system that you will use to write components with..
    You will be given an instruction from the user and you are to do what they ask.`,
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
  // Write the code to a file
  fs.writeFileSync(fileName, code);
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
