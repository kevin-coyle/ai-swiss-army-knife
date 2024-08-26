import fs from "fs";
import OpenAI from "openai";
import readline from "readline";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as path from "path";

const COMPONENT_SOURCE =
  "/home/kevincoyle/dev/clients/bigmedium/nasdaq/generator-lab/src/components";
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
    You are a experienced web developer who will have be given a custom-elements.json file and some examples for a lit3 based design system.
    You will be given an instruction from the user and you are to write some HTML code using the design system.
    Don't use JSON.stringify in the .data attribute for nef-rich table.
    If you are going to use a component and you've not seen the storybook file for it ALWAYS get it and read it first. The component file names for that look like Alert, Drawer, Button, Rich-table etc.
    Only use the design system components. For example <nef-button>. Use the custom-elements.json file to figure out how to use the design system. Don't write a file unless the user asks specifically.`,
  };

  let chatHistory = [
    systemPrompt,
    {
      role: "user",
      content: `Here is the custom-elements file: ${customElementsfile}`,
    },
    {
      role: "user",
      content: `Here is the stories file which will show you how to use the component: ${storiesFile}`,
    },
    { role: "user", content: `Here is the data file: ${dataFile}` },
  ];

  while (true) {
    const query = await new Promise((resolve) => {
      rl.question("Please enter your query: ", resolve);
    });

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
            function: getComponentStorybookFile,
            parameters: zodToJsonSchema(GetStoryParameters),
          },
        },
        {
          type: "function",
          function: {
            function: listDirectory,
            parameters: zodToJsonSchema(GetDirectoryParameters),
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
function getComponentStorybookFile(options: string) {
  console.log("Getting Storybook File..." + options);
  const { componentFileName } = JSON.parse(options);
  const storiesFile = `${COMPONENT_SOURCE}/${componentFileName}/${componentFileName}.stories.ts`;
  if (!fs.existsSync(storiesFile)) {
    return "File does not exist or is not readable";
  }
  return fs.readFileSync(storiesFile, "utf8");
}
