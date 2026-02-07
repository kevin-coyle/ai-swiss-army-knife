import { describe, it, expect } from "bun:test";
import { createDefaultSlashCommandRegistry } from "../slashCommands";

describe("slash command registry", () => {
  it("ignores non-slash input", async () => {
    const registry = createDefaultSlashCommandRegistry();
    const output: string[] = [];
    let activeModel = "o3-mini";

    const handled = await registry.handleInput("hello world", {
      getModel: () => activeModel,
      setModel: (nextModel) => {
        activeModel = nextModel;
      },
      print: (message) => output.push(message),
    });

    expect(handled).toBe(false);
    expect(output.length).toBe(0);
    expect(activeModel).toBe("o3-mini");
  });

  it("shows and updates model with /model", async () => {
    const registry = createDefaultSlashCommandRegistry();
    const output: string[] = [];
    let activeModel = "o3-mini";

    await registry.handleInput("/model", {
      getModel: () => activeModel,
      setModel: (nextModel) => {
        activeModel = nextModel;
      },
      print: (message) => output.push(message),
    });

    await registry.handleInput("/model gpt-4o", {
      getModel: () => activeModel,
      setModel: (nextModel) => {
        activeModel = nextModel;
      },
      print: (message) => output.push(message),
    });

    expect(output[0]).toContain("Current model: o3-mini");
    expect(output[1]).toContain("Active model set to: gpt-4o");
    expect(activeModel).toBe("gpt-4o");
  });

  it("prints help text", async () => {
    const registry = createDefaultSlashCommandRegistry();
    const output: string[] = [];
    let activeModel = "o3-mini";

    await registry.handleInput("/help", {
      getModel: () => activeModel,
      setModel: (nextModel) => {
        activeModel = nextModel;
      },
      print: (message) => output.push(message),
    });

    expect(output.length).toBe(1);
    expect(output[0]).toContain("Slash commands:");
    expect(output[0]).toContain("/model <name>");
  });
});
