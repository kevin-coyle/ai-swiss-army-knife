# AI Swiss Army Knife
## Overview
This tool allows you to interact with a Linux or macOS based system through various commands that are processed by OpenAI's ChatGPT model. You can perform file operations, run shell commands, search the web, and view web pages directly.

## Installation
To install the necessary dependencies, run:

```bash
bun install
```

## Running the Tool
To execute the tool, use the following command:

```bash
bun run index.ts
```

## Usage
Once the tool is running, you can interact with it by entering the following types of queries:

### File Operations
- **Read File**: You can read the contents of a file by providing its file name.
  - Example: `readFile {"fileName": "example.txt"}`

- **Write Code to File**: You can write code to a specific file.
  - Example: `writeCode {"code": "console.log('Hello, World!');", "fileName": "hello.js"}`

- **List Directory**: You can list all files in a specified directory.
  - Example: `listDirectory {"directory": "/path/to/directory"}`

### Command Execution
- **Run Command**: You can execute any shell command and get the output.
  - Example: `runCommand {"command": "ls -la"}`

### Web Interaction
- **Google Search**: You can perform a web search and retrieve the results.
  - Example: `googleSearch {"query": "latest news"}`

- **View Website**: You can view the content of a web page by providing its URL. The content will be limited to the first 1000 characters for display.
  - Example: `viewWebsite {"url": "https://example.com"}`

## Environment Variables
Make sure to set the following environment variables for API access:
- `OPENAI_API_KEY` - Your OpenAI API Key.
- `SERPAPI_API_KEY` - Your SerpApi API Key for conducting Google searches.

## Conclusion
This tool provides a simple yet powerful interface to perform various tasks using an AI-assisted backend. Enhance your productivity by utilizing this tool for file management, web searches, and command execution directly through queries.
