import fs from "fs";
import path from "path";

type AppendSessionNoteInput = {
  note: string;
  sessionId?: string;
};

function getMemoryRoot(): string {
  const configuredPath = process.env.SAK_MEMORY_DIR;
  if (configuredPath && configuredPath.trim().length > 0) {
    return path.resolve(process.cwd(), configuredPath);
  }

  return path.resolve(process.cwd(), ".sak-memory");
}

function appendSessionNote(options: string) {
  const { note, sessionId = "default" } = JSON.parse(
    options,
  ) as AppendSessionNoteInput;

  if (typeof note !== "string" || note.trim().length === 0) {
    return "Error: note must be a non-empty string";
  }

  if (typeof sessionId !== "string" || sessionId.trim().length === 0) {
    return "Error: sessionId must be a non-empty string";
  }

  try {
    const memoryRoot = getMemoryRoot();
    const safeSessionId = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const targetFile = path.join(memoryRoot, `${safeSessionId}.md`);

    fs.mkdirSync(memoryRoot, { recursive: true });

    const timestamp = new Date().toISOString();
    const formattedNote = `- [${timestamp}] ${note.trim()}\n`;
    fs.appendFileSync(targetFile, formattedNote, "utf8");

    return `Saved note to session "${safeSessionId}"`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error saving note: ${error.message}`;
    }
    return "Error saving note";
  }
}

export default appendSessionNote;
