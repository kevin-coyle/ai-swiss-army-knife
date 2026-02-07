## Env Setup

Create your local env file:

```bash
cp .env.example .env
```

Fill in these values in `.env`:

- `OPENAI_API_KEY` (required for `index.ts`)
- `SERPAPI_API_KEY` (optional, enables `googleSearch`)
- `ANTHROPIC_API_KEY` (optional, used by `claude.ts`)
- `SAK_MODEL` (default: `o3-mini`)
- `SAK_CONTEXT_TRIGGER_TOKENS` (default: `28000`)
- `SAK_KEEP_RECENT_MESSAGES` (default: `12`)
- `SAK_SESSION_ID` (default: `default`)
- `SAK_ENABLE_LOGGING` (default: `true`)
- `SAK_LOG_DIR` (default: `.sak-logs`)
- `SAK_MEMORY_DIR` (default: `.sak-memory`)
- `SAK_PROMPT_PLACEHOLDER` (optional TUI prompt text)

## Slash Commands

- `/help`: list available slash commands.
- `/model`: show current active model.
- `/model <name>`: switch model for subsequent turns (example: `/model gpt-4o`).

## Testing Instructions

To run the tests for this project, you can use the following command:

```bash
bun test
```

This command will run all the tests in the project and display the results in the terminal.
