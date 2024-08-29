import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import readline from "readline";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  writeCode,
  readFile,
  listDirectory,
  runCommand,
  googleSearch,
  viewWebsite,
} from "./functions";

dotenv.config(); // Load environment variables from .env file

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GetWriteFileParameters = z.object({
  code: z.string(),
  fileName: z.string(),
});

const GetReadFileParameters = z.object({
  fileName: z.string(),
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
  const systemPrompt = {
    role: "system",
    content: `
    You are a experienced web developer who will be given access to a linux or mac based system that you will use to write components with.
    You will be given an instruction from the user and you are to do what they ask.
    The user is running a linux based system.
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

    const response = await anthropic.completions.create({
      prompt: chatHistory.map(entry => `${entry.role}: ${entry.content}`).join('\n\n'),
      max_tokens: 8192,
      stop_sequences: ["\n\n"],
      model: "claude-3-5-sonnet-20240620",
    });

    const aiReply = response.completion;
    console.log(aiReply);

    for (const message of response.messages) {
      if (message.type === "function_call") {
        const functionName = message.name;
        const functionArgs = JSON.parse(message.arguments);

        switch (functionName) {
          case "writeCode":
            await writeCode(functionArgs);
            break;
          case "readFile":
            const fileContent = await readFile(functionArgs);
            console.log(fileContent);
            break;
          case "listDirectory":
            const directoryContent = await listDirectory(functionArgs);
            console.log(directoryContent);
            break;
          case "runCommand":
            const commandOutput = await runCommand(functionArgs);
            console.log(commandOutput);
            break;
          case "googleSearch":
            const searchResults = await googleSearch(functionArgs);
            console.log(searchResults);
            break;
          case "viewWebsite":
            const websiteContent = await viewWebsite(functionArgs);
            console.log(websiteContent);
            break;
          default:
            console.log(`Unknown function: ${functionName}`);
        }
      }
    }

    chatHistory.push({ role: "assistant", content: aiReply });
  }
}

main().catch(console.error);
