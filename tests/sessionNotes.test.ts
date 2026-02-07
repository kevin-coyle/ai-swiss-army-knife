import { describe, it, expect, beforeEach, afterAll } from "bun:test";
import fs from "fs";
import path from "path";
import appendSessionNote from "../functions/appendSessionNote";
import getSessionNotes from "../functions/getSessionNotes";

const TEST_MEMORY_DIR = ".tmp-sak-memory-tests";
const resolvedTestMemoryDir = path.resolve(process.cwd(), TEST_MEMORY_DIR);

describe("session memory tools", () => {
  beforeEach(() => {
    process.env.SAK_MEMORY_DIR = TEST_MEMORY_DIR;
    fs.rmSync(resolvedTestMemoryDir, { recursive: true, force: true });
  });

  afterAll(() => {
    fs.rmSync(resolvedTestMemoryDir, { recursive: true, force: true });
    delete process.env.SAK_MEMORY_DIR;
  });

  it("appends notes and reads them back for a session", () => {
    const first = appendSessionNote(
      JSON.stringify({ sessionId: "demo-session", note: "Remember feature A" }),
    );
    const second = appendSessionNote(
      JSON.stringify({ sessionId: "demo-session", note: "Remember feature B" }),
    );
    const notes = getSessionNotes(
      JSON.stringify({ sessionId: "demo-session", maxNotes: 10 }),
    );

    expect(first).toContain("Saved note");
    expect(second).toContain("Saved note");
    expect(notes).toContain("Remember feature A");
    expect(notes).toContain("Remember feature B");
  });

  it("returns only the latest N notes when maxNotes is provided", () => {
    appendSessionNote(JSON.stringify({ sessionId: "limits", note: "First note" }));
    appendSessionNote(JSON.stringify({ sessionId: "limits", note: "Second note" }));
    const notes = getSessionNotes(
      JSON.stringify({ sessionId: "limits", maxNotes: 1 }),
    );

    expect(notes).not.toContain("First note");
    expect(notes).toContain("Second note");
  });
});
