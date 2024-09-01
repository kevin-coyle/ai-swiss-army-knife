import Anthropic from "@anthropic-ai/sdk";
import readline from "readline";
import dotenv from "dotenv";
import { listDirectory } from "./functions"; // Import the listDirectory function
import { systemPrompt } from "./systemPrompt";
dotenv.config(); // Load environment variables from .env file

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

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let chatHistory = [];
  let skipPrompt = false;
  while (true) {
    console.log(chatHistory);
    if (!skipPrompt) {
      const query = (await new Promise((resolve) => {
        rl.question("Please enter your query: ", resolve);
      })) as string;
      chatHistory.push({ role: "user", content: query });
      skipPrompt = false;
    }

    try {
      const response = await anthropic.messages.create({
        max_tokens: 8192,
        system: systemPrompt,
        messages: chatHistory,
        model: "claude-3-5-sonnet-20240620",
        tools: [listDirectoryTool],
      });

      console.log("Claude Response:", response.content);

      response.content.forEach((message: any) => {
        if (message.type === "tool_use") {
          console.log(message);
          const toolId = message.id;
          const toolName = message.name;
          const toolParams = message.input;
          if (toolName === "listDirectory") {
            const result = listDirectory(JSON.stringify(toolParams));
            // {
            //   "role": "user",
            //   "content": [
            //     {
            //       "type": "tool_result",
            //       "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
            //       "content": "15 degrees"
            //     }
            //   ]
            // }
            chatHistory.push({
              role: "assistant",
              content: [message],
            });
            chatHistory.push({
              role: "user",
              content: [
                {
                  type: "tool_result",
                  tool_use_id: toolId,
                  content: JSON.stringify(result),
                },
              ],
            });
            skipPrompt = true;
          }
        } else {
          chatHistory.push({
            role: "assistant",
            content: message.text,
          });
        }
      });
    } catch (error) {
      console.error("Error communicating with Claude:", error);
    }
  }
}

main().catch(console.error);
