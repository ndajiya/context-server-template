#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

// Log to stderr for debugging clarity
console.error("STARTING GENERIC MCP SERVER");

// Create server instance
const server = new Server(
  { name: "generic-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define tools (example toolset)
const TOOLS = [
  {
    name: "about",
    description: "Returns information about this MCP server",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "hello",
    description: "A simple greeting tool",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name to greet (optional)"
        }
      },
      required: []
    }
  }
];

// Handle JSON-RPC requests
server.fallbackRequestHandler = async (request) => {
  try {
    const { method, params, id } = request;
    console.error(`REQUEST: ${method} [${id}]`);

    switch (method) {
      case "initialize":
        return {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "generic-mcp-server", version: "1.0.0" }
        };

      case "tools/list":
        return { tools: TOOLS };

      case "tools/call": {
        const { name, arguments: args = {} } = params || {};

        if (name === "about") {
          return {
            content: [
              {
                type: "text",
                text: `This is a generic MCP server (version 1.0.0).\n\nIt supports any LLM that follows the Model Context Protocol.`
              }
            ]
          };
        }

        if (name === "hello") {
          const userName = args.name || "World";
          return {
            content: [
              {
                type: "text",
                text: `Hello, ${userName}! This is a response from the generic MCP server.`
              }
            ]
          };
        }

        return {
          error: {
            code: -32601,
            message: `Tool not found: ${name}`
          }
        };
      }

      case "resources/list":
        return { resources: [] };

      case "prompts/list":
        return { prompts: [] };

      default:
        return {};
    }

  } catch (error) {
    console.error(`ERROR: ${error.stack || error.message}`);
    return {
      error: {
        code: -32603,
        message: "Internal error",
        data: { details: error.message }
      }
    };
  }
};

// Setup stdio transport
const transport = new StdioServerTransport();

// Prevent shutdown on SIGTERM for container environments
process.on("SIGTERM", () => {
  console.error("SIGTERM received — ignoring to stay alive");
});

// Connect server to transport
server.connect(transport)
  .then(() => console.error("Server connected"))
  .catch(error => {
    console.error(`Connection error: ${error.message}`);
    process.exit(1);
  });
