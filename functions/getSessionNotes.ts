import fs from "fs";
import path from "path";

type GetSessionNotesInput = {
  sessionId?: string;
  maxNotes?: number;
};

function getMemoryRoot(): string {
  const configuredPath = process.env.SAK_MEMORY_DIR;
  if (configuredPath && configuredPath.trim().length > 0) {
    return path.resolve(process.cwd(), configuredPath);
  }

  return path.resolve(process.cwd(), ".sak-memory");
}

function getSessionNotes(options: string) {
  const { sessionId = "default", maxNotes = 50 } = JSON.parse(
    options,
  ) as GetSessionNotesInput;

  if (typeof sessionId !== "string" || sessionId.trim().length === 0) {
    return "Error: sessionId must be a non-empty string";
  }

  const parsedMaxNotes = Number(maxNotes);
  if (Number.isNaN(parsedMaxNotes) || parsedMaxNotes < 1) {
    return "Error: maxNotes must be a positive number";
  }

  const safeSessionId = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const targetFile = path.join(getMemoryRoot(), `${safeSessionId}.md`);

  if (!fs.existsSync(targetFile)) {
    return "";
  }

  const content = fs.readFileSync(targetFile, "utf8");
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.slice(-parsedMaxNotes).join("\n");
}

export default getSessionNotes;
