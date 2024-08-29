import Anthropic from "@anthropic-ai/sdk";
import Tool from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { returnNumber } from "./tools"; // Import the new tool function
import { listDirectory } from "./functions";
dotenv.config(); // Load environment variables from .env file
import { systemPrompt } from "./systemPrompt";
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
const listDirectoryTool = {
  name: "listDirectory",
  description: "List the contents of a directory",
  input_schema: {
    type: "object",
    properties: {
      directory: {
        type: "string",
        description: "The directory to list",
      },
    },
  },
};

async function callClaude() {
  try {
    // Invoke the tool function
    const toolResult = await returnNumber();
    console.log("Tool Result: ", toolResult);

    const response = await anthropic.messages.create({
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: "List the contents of the current directory",
        },
      ],
      model: "claude-3-5-sonnet-20240620",
      tools: [listDirectoryTool],
    });
    console.log("Claude Response:", response.content);
    response.content.forEach((message: any) => {
      if (message.type === "tool_use") {
        const toolName = message.name;
        const toolParams = message.input;
        if (toolName === "listDirectory") {
          console.log(listDirectory(JSON.stringify(toolParams)));
        }
      }
    });
  } catch (error) {
    console.error("Error communicating with Claude:", error);
  }
}

callClaude();
