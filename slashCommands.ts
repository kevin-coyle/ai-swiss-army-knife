export type SlashCommandContext = {
  getModel: () => string;
  setModel: (nextModel: string) => void;
  print: (message: string) => void;
};

export type SlashCommandDefinition = {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  handler: (
    args: string[],
    context: SlashCommandContext,
  ) => Promise<string | void> | string | void;
};

type ParsedSlashCommand = {
  name: string;
  args: string[];
};

function parseSlashCommand(input: string): ParsedSlashCommand | null {
  if (!input.startsWith("/")) {
    return null;
  }

  const trimmedInput = input.trim();
  if (trimmedInput.length <= 1) {
    return { name: "help", args: [] };
  }

  const withoutSlash = trimmedInput.slice(1);
  const [rawName, ...args] = withoutSlash.split(/\s+/);
  const name = rawName.trim().toLowerCase();

  if (name.length === 0) {
    return { name: "help", args: [] };
  }

  return { name, args };
}

export class SlashCommandRegistry {
  private readonly commands = new Map<string, SlashCommandDefinition>();
  private readonly canonicalNames = new Set<string>();

  register(definition: SlashCommandDefinition): void {
    const normalizedName = definition.name.trim().toLowerCase();
    if (normalizedName.length === 0) {
      throw new Error("Slash command name cannot be empty");
    }

    const normalizedAliases = (definition.aliases ?? []).map((alias) =>
      alias.trim().toLowerCase(),
    );

    this.canonicalNames.add(normalizedName);
    this.commands.set(normalizedName, {
      ...definition,
      name: normalizedName,
      aliases: normalizedAliases,
    });

    for (const alias of normalizedAliases) {
      this.commands.set(alias, {
        ...definition,
        name: normalizedName,
        aliases: normalizedAliases,
      });
    }
  }

  listCommands(): SlashCommandDefinition[] {
    return Array.from(this.canonicalNames)
      .map((name) => this.commands.get(name))
      .filter((definition): definition is SlashCommandDefinition =>
        Boolean(definition),
      )
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  async handleInput(
    input: string,
    context: SlashCommandContext,
  ): Promise<boolean> {
    const parsed = parseSlashCommand(input);
    if (!parsed) {
      return false;
    }

    const command = this.commands.get(parsed.name);
    if (!command) {
      context.print(
        `Unknown slash command: /${parsed.name}. Run /help for available commands.`,
      );
      return true;
    }

    const result = await command.handler(parsed.args, context);
    if (typeof result === "string" && result.trim().length > 0) {
      context.print(result);
    }

    return true;
  }
}

export function createDefaultSlashCommandRegistry(): SlashCommandRegistry {
  const registry = new SlashCommandRegistry();

  registry.register({
    name: "help",
    aliases: ["commands"],
    usage: "/help",
    description: "Show available slash commands.",
    handler: () => {
      const commandLines = registry
        .listCommands()
        .map((command) => `- ${command.usage}: ${command.description}`);
      return ["Slash commands:", ...commandLines].join("\n");
    },
  });

  registry.register({
    name: "model",
    usage: "/model <name>",
    description: "Get or set the active model for subsequent turns.",
    handler: (args, context) => {
      if (args.length === 0) {
        return `Current model: ${context.getModel()}`;
      }

      const nextModel = args.join(" ").trim();
      if (nextModel.length === 0) {
        return "Usage: /model <name>";
      }

      context.setModel(nextModel);
      return `Active model set to: ${nextModel}`;
    },
  });

  return registry;
}
