# context-server-template
LLM-agnostic Context Server- node

This is a lightweight, generic [Model Context Protocol (MCP)](https://github.com/modelcontext/protocol) server implementation written in Node.js. It defines a few simple tools and can be used with any LLM that supports the MCP tool calling interface — including Claude, ChatGPT (via wrappers), OpenDevin, or open-source LLMs.

## 🛠 Features

- Supports Context Server over stdio
- Defines two example tools:
  - `about` — returns information about the server
  - `hello` — returns a friendly greeting
- Built with the official [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

## 📦 Installation

```bash
git clone https://github.com/yourusername/cs-generic-server.git
cd cs-generic-server
npm install
```

## 🚀 Running the Server

```bash
node index.js
```
This will start the server and connect it via stdio (e.g., for use in Claude Desktop or similar tool-calling environments).

## 🔧 Tool Definitions

1. about
Description: Returns information about the MCP server.

Input Schema: {}

2. hello
Description: Returns a greeting.

Input Schema:
```
json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name to greet (optional)"
    }
  },
  "required": []
}
```
## 💡 Customization

To add your own tools, modify the TOOLS array in index.js and extend the "tools/call" logic to handle them.

## 🧪 Testing

You can test the server using:

Claude Desktop (via stdio plugin)

A custom LLM tool-caller that supports MCP over stdio

Manual calls using tools like ncat, jq, or a test harness

## 🛠 CS Methods Supported

initialize

tools/list

tools/call

resources/list (returns empty array)

prompts/list (returns empty array)

## 🛡 License

This project is licensed under the MIT License. Please retain attribution in derivative works.

## 🙌 Credits

Built using the Model Context Protocol SDK.
