#!/usr/bin/env node

// Claude Think Tool MCP Server for Cursor
// This tool allows users to activate Claude's thinking mode by typing "think" in the chat

const readline = require('readline');

// Set up interface to read from stdin and write to stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize server and listen for messages
function initialize() {
  // Send server information to Cursor
  console.log(JSON.stringify({
    jsonrpc: "2.0",
    method: "mcp/server_info",
    params: {
      name: "claude-think-tool",
      version: "1.0.0",
      tools: [
        {
          name: "think",
          description: "Instructs Claude to use explicit, structured reasoning before providing an answer",
          parameters: {
            type: "object",
            properties: {
              prompt: {
                type: "string",
                description: "The question or task Claude should think about"
              }
            },
            required: ["prompt"]
          }
        }
      ]
    }
  }));

  // Process incoming lines
  rl.on('line', (line) => {
    try {
      const request = JSON.parse(line);
      
      if (request.method === "mcp/execute") {
        handleExecute(request);
      }
    } catch (error) {
      console.error(`Error processing request: ${error.message}`);
      
      // Log the problematic line for debugging
      console.error(`Problematic line: ${line}`);
    }
  });

  // Handle process exit
  process.on('SIGINT', () => {
    console.error('MCP server shutting down');
    process.exit(0);
  });
}

// Handle execute requests
function handleExecute(request) {
  const { id, params } = request;
  const { tool, arguments: args } = params;

  if (tool === "think") {
    const prompt = args.prompt;
    
    // Format the thinking prompt with special markers
    const thinkingResponse = {
      jsonrpc: "2.0",
      id: id,
      result: {
        output: formatThinkingPrompt(prompt)
      }
    };
    
    console.log(JSON.stringify(thinkingResponse));
  } else {
    // Handle unknown tool request
    console.log(JSON.stringify({
      jsonrpc: "2.0",
      id: id,
      error: {
        code: -32601,
        message: `Tool "${tool}" not found`
      }
    }));
  }
}

// Format the thinking prompt with the appropriate structure
function formatThinkingPrompt(prompt) {
  return `<thinking>
Please work through this question step by step:
${prompt}
</thinking>

[After careful analysis, provide your final answer here]`;
}

// Start the server
initialize(); 