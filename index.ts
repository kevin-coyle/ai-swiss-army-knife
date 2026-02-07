#!/usr/bin/env bun
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import readline from "readline";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import openaiTokenCounter from "openai-gpt-token-counter";
import chalk from "chalk";
import {
  writeCode,
  readFile,
  listDirectory,
  runCommand,
  googleSearch,
  viewWebsite,
  countLetter,
  countWords,
  checkEbay,
  appendSessionNote,
  getSessionNotes,
} from "./functions";
import { handleImage } from "./functions/handleImage";
import { systemPrompt } from "./systemPrompt";
import { createDefaultSlashCommandRegistry } from "./slashCommands";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = process.env.SAK_MODEL ?? "o3-mini";
const CONTEXT_TRIGGER_TOKENS = Number(
  process.env.SAK_CONTEXT_TRIGGER_TOKENS ?? "28000",
);
const KEEP_RECENT_MESSAGES = Number(process.env.SAK_KEEP_RECENT_MESSAGES ?? "12");
const SESSION_ID = process.env.SAK_SESSION_ID ?? "default";
const ENABLE_LOGGING =
  (process.env.SAK_ENABLE_LOGGING ?? "true").toLowerCase() !== "false";
const LOG_DIR = path.resolve(process.cwd(), process.env.SAK_LOG_DIR ?? ".sak-logs");
const SUMMARY_PREFIX = "Conversation summary (compressed context):";
const UI_PLACEHOLDER = process.env.SAK_PROMPT_PLACEHOLDER ?? "Write tests for @filename";

let currentModel = DEFAULT_MODEL;
const slashCommandRegistry = createDefaultSlashCommandRegistry();
console.log("Using model: ", currentModel);

type ConversationMessage = {
  role: "system" | "user" | "assistant";
  content: any;
};

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

const GetCountLettersParameters = z.object({
  letter: z.string(),
  word: z.string(),
});

const GetCountWordsParameters = z.object({
  text: z.string(),
});

const GetCheckEbayParameters = z.object({
  item: z.string(),
});

const GetAppendSessionNoteParameters = z.object({
  note: z.string(),
  sessionId: z.string().optional(),
});

const GetSessionNotesParameters = z.object({
  sessionId: z.string().optional(),
  maxNotes: z.number().optional(),
});

function createPreamble() {
  console.log(chalk.bold.cyan("Swiss Army Knife"));
  console.log(chalk.gray("Type your request. Use 'exit' to quit."));
  console.log(chalk.gray("Image mode: read_image <path>"));
  console.log(chalk.gray("Slash commands: /help, /model <name>"));
}

function truncateForLogs(value: string, maxLength = 2500): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...<truncated>`;
}

function toLogString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    if (error instanceof Error) {
      return `Unserializable value: ${error.message}`;
    }
    return "Unserializable value";
  }
}

function logEvent(eventType: string, payload: Record<string, unknown>) {
  if (!ENABLE_LOGGING) {
    return;
  }

  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const logFile = path.join(LOG_DIR, `${date}.jsonl`);

    fs.appendFileSync(
      logFile,
      `${JSON.stringify({
        timestamp: new Date().toISOString(),
        eventType,
        payload,
      })}\n`,
      "utf8",
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to write logs: ${error.message}`);
    }
  }
}

function safeTokenCount(chatHistory: ConversationMessage[]): number {
  try {
    return openaiTokenCounter.chat(chatHistory as any, "gpt-4o");
  } catch {
    return 0;
  }
}

function calculateContextLeftPercent(chatHistory: ConversationMessage[]): number {
  const tokenCount = safeTokenCount(chatHistory);
  if (CONTEXT_TRIGGER_TOKENS <= 0) {
    return 100;
  }

  const percent = Math.round(
    100 - (tokenCount / CONTEXT_TRIGGER_TOKENS) * 100,
  );
  return Math.max(0, Math.min(100, percent));
}

function padOrTrim(text: string, width: number): string {
  if (width <= 0) {
    return "";
  }

  if (text.length > width) {
    if (width <= 3) {
      return text.slice(0, width);
    }
    return `${text.slice(0, width - 3)}...`;
  }

  return `${text}${" ".repeat(width - text.length)}`;
}

function buildPromptFrame(chatHistory: ConversationMessage[]): string {
  const terminalWidth = process.stdout.columns ?? 120;
  const rowWidth = Math.max(40, terminalWidth - 2);
  const contextLeftPercent = calculateContextLeftPercent(chatHistory);

  const commandText = `> ${UI_PLACEHOLDER}`;
  const topRow = chalk.bgHex("#1f4b57").white(
    ` ${padOrTrim(commandText, rowWidth - 2)} `,
  );

  const leftHint = "? for shortcuts";
  const rightHint = `${contextLeftPercent}% context left`;
  const spacing = Math.max(1, rowWidth - 2 - leftHint.length - rightHint.length);
  const statusText = ` ${leftHint}${" ".repeat(spacing)}${rightHint} `;
  const statusRow = chalk.hex("#8eaab1")(padOrTrim(statusText, rowWidth));

  const inputPrompt = chalk.hex("#9cc9d4")("> ");

  return `${topRow}\n${statusRow}\n${inputPrompt}`;
}

function stripSummaryMessages(
  chatHistory: ConversationMessage[],
): ConversationMessage[] {
  if (chatHistory.length <= 1) {
    return chatHistory;
  }

  return [
    chatHistory[0],
    ...chatHistory
      .slice(1)
      .filter(
        (message) =>
          !(
            message.role === "system" &&
            typeof message.content === "string" &&
            message.content.startsWith(SUMMARY_PREFIX)
          ),
      ),
  ];
}

function wrapTool(
  name: string,
  toolFn: (options: string) => unknown | Promise<unknown>,
) {
  const wrappedTool = async function (options: string) {
    const startedAt = Date.now();

    try {
      const result = await Promise.resolve(toolFn(options));
      logEvent("tool_result", {
        name,
        durationMs: Date.now() - startedAt,
        options: truncateForLogs(options),
        result: truncateForLogs(toLogString(result)),
      });
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown tool execution error";
      logEvent("tool_error", {
        name,
        durationMs: Date.now() - startedAt,
        options: truncateForLogs(options),
        error: message,
      });
      return `Error running ${name}: ${message}`;
    }
  };

  Object.defineProperty(wrappedTool, "name", { value: name, configurable: true });

  return wrappedTool;
}

async function summarizeOldMessages(
  oldMessages: ConversationMessage[],
  existingSummary: string,
): Promise<string> {
  const oldMessageText = oldMessages
    .map((message, index) => {
      return `${index + 1}. ${message.role.toUpperCase()}: ${toLogString(message.content)}`;
    })
    .join("\n\n");

  const summaryResponse = await openai.chat.completions.create({
    model: currentModel,
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You summarize prior conversation context for an autonomous coding agent. Keep only durable requirements, decisions, constraints, and unresolved tasks. Keep it concise and factual.",
      },
      {
        role: "user",
        content: [
          "Existing summary:",
          existingSummary || "(none)",
          "",
          "Messages to compress:",
          oldMessageText,
          "",
          "Return an updated summary as plain text.",
        ].join("\n"),
      },
    ],
  });

  return summaryResponse.choices[0]?.message?.content?.trim() ?? existingSummary;
}

async function compactHistoryIfNeeded(
  chatHistory: ConversationMessage[],
): Promise<ConversationMessage[]> {
  const normalizedHistory = stripSummaryMessages(chatHistory);
  const tokenModel = "gpt-4o";

  let tokenCount = 0;
  try {
    tokenCount = openaiTokenCounter.chat(normalizedHistory as any, tokenModel);
  } catch {
    return normalizedHistory;
  }

  if (tokenCount <= CONTEXT_TRIGGER_TOKENS) {
    return normalizedHistory;
  }

  const existingSummaryMessage = chatHistory.find(
    (message) =>
      message.role === "system" &&
      typeof message.content === "string" &&
      message.content.startsWith(SUMMARY_PREFIX),
  );
  const existingSummary =
    existingSummaryMessage && typeof existingSummaryMessage.content === "string"
      ? existingSummaryMessage.content.replace(`${SUMMARY_PREFIX}\n`, "")
      : "";

  const keepCount = Math.max(2, KEEP_RECENT_MESSAGES);
  const oldMessages = normalizedHistory.slice(1, -keepCount);
  const recentMessages = normalizedHistory.slice(-keepCount);

  if (oldMessages.length === 0) {
    return normalizedHistory;
  }

  const updatedSummary = await summarizeOldMessages(oldMessages, existingSummary);
  const compactedHistory: ConversationMessage[] = [
    normalizedHistory[0],
    {
      role: "system",
      content: `${SUMMARY_PREFIX}\n${updatedSummary}`,
    },
    ...recentMessages,
  ];

  try {
    const compactedCount = openaiTokenCounter.chat(
      compactedHistory as any,
      tokenModel,
    );
    logEvent("history_compacted", {
      beforeTokenCount: tokenCount,
      afterTokenCount: compactedCount,
      keptRecentMessages: recentMessages.length,
    });
  } catch {
    logEvent("history_compacted", {
      beforeTokenCount: tokenCount,
      keptRecentMessages: recentMessages.length,
    });
  }

  return compactedHistory;
}

async function main() {
  createPreamble();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const systemPromptMessage: ConversationMessage = {
    role: currentModel !== "o1-mini" ? "system" : "user",
    content: systemPrompt,
  };

  const tools = [
    {
      type: "function" as const,
      function: {
        function: wrapTool("writeCode", writeCode),
        parameters: zodToJsonSchema(GetWriteFileParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("readFile", readFile),
        parameters: zodToJsonSchema(GetReadFileParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("listDirectory", listDirectory),
        parameters: zodToJsonSchema(GetDirectoryParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("runCommand", runCommand),
        description:
          "Run a command in the terminal. This is for non interactive commands only and will timeout after 60s",
        parameters: zodToJsonSchema(GetRunCommandParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("googleSearch", googleSearch),
        parameters: zodToJsonSchema(GetGoogleSearchParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("viewWebsite", viewWebsite),
        parameters: zodToJsonSchema(GetViewWebsiteParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("countLetter", countLetter),
        description: "Count a single letter in a word.",
        parameters: zodToJsonSchema(GetCountLettersParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("countWords", countWords),
        parameters: zodToJsonSchema(GetCountWordsParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("checkEbay", checkEbay),
        parameters: zodToJsonSchema(GetCheckEbayParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("appendSessionNote", appendSessionNote),
        description:
          "Append a durable note to session memory for long-running tasks.",
        parameters: zodToJsonSchema(GetAppendSessionNoteParameters),
      },
    },
    {
      type: "function" as const,
      function: {
        function: wrapTool("getSessionNotes", getSessionNotes),
        description: "Retrieve existing notes from session memory.",
        parameters: zodToJsonSchema(GetSessionNotesParameters),
      },
    },
  ];

  let chatHistory: ConversationMessage[] = [systemPromptMessage];

  const existingNotes = getSessionNotes(
    JSON.stringify({ sessionId: SESSION_ID, maxNotes: 100 }),
  );
  if (typeof existingNotes === "string" && existingNotes.trim().length > 0) {
    chatHistory.push({
      role: "system",
      content: `Persistent session notes (${SESSION_ID}):\n${existingNotes}`,
    });
  }

  while (true) {
    const query = (await new Promise((resolve) => {
      rl.question(buildPromptFrame(chatHistory), resolve);
    })) as string;

    if (query === "exit") {
      break;
    }

    if (!query) {
      continue;
    }

    const handledSlashCommand = await slashCommandRegistry.handleInput(query, {
      getModel: () => currentModel,
      setModel: (nextModel: string) => {
        currentModel = nextModel;
        logEvent("model_changed", {
          model: currentModel,
          sessionId: SESSION_ID,
        });
      },
      print: (message: string) => {
        console.log(chalk.hex("#9cc9d4")(message));
      },
    });
    if (handledSlashCommand) {
      continue;
    }

    chatHistory.push({ role: "user", content: query });
    logEvent("user_query", {
      sessionId: SESSION_ID,
      query: truncateForLogs(query),
    });

    if (query.startsWith("read_image")) {
      const imagePath = query.split(" ")[1];
      if (imagePath) {
        try {
          const imageBase64 = await handleImage({ imagePath });
          chatHistory.push({
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64.base64Image}`,
                },
              },
            ],
          });
        } catch (error) {
          console.error("Error handling image:", error);
          logEvent("runtime_error", {
            error:
              error instanceof Error
                ? `Error handling image: ${error.message}`
                : "Error handling image",
          });
          continue;
        }
      } else {
        console.log("Please provide an image path after 'read_image'");
        continue;
      }
    }

    try {
      chatHistory = await compactHistoryIfNeeded(chatHistory);

      const runner = openai.beta.chat.completions.runTools({
        model: currentModel,
        messages: chatHistory as any,
        tools,
      });

      let aiReply = (await runner.finalContent()) as string;
      if (aiReply === null) {
        aiReply = "done";
      }

      console.log(chalk.green(aiReply));
      chatHistory.push({ role: "assistant", content: aiReply });

      try {
        const tokenCount = safeTokenCount(chatHistory);
        console.log("Token Count: ", tokenCount);
        logEvent("assistant_reply", {
          tokenCount,
          response: truncateForLogs(aiReply),
        });
      } catch {
        logEvent("assistant_reply", {
          response: truncateForLogs(aiReply),
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown runtime error";
      console.error(`Error: ${errorMessage}`);
      logEvent("runtime_error", {
        error: errorMessage,
      });
    }
  }

  rl.close();
}

main().catch(console.error);
