#!/usr/bin/env node

/**
 * Cursor & Claude Think MCP Server
 * 
 * This tool enables Claude's explicit thinking mode in Cursor,
 * allowing users to see Claude's step-by-step reasoning process
 * when they type "think [question]" in the chat.
 * 
 * Version: 1.0.0
 * License: MIT
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  debug: process.env.CLAUDE_THINK_DEBUG === 'true',
  logFile: process.env.CLAUDE_THINK_LOG_FILE || path.join(process.env.HOME || process.env.USERPROFILE || '.', '.cursor-claud-think-mcp.log'),
  version: '1.0.0'
};

// Set up interface to read from stdin and write to stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Logs a message if debug mode is enabled
 * @param {string} message - The message to log
 * @param {string} level - Log level (info, error, warn)
 */
function log(message, level = 'info') {
  if (!CONFIG.debug) return;
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
  
  // Log to console
  if (level === 'error') {
    console.error(logMessage);
  } else {
    console.error(logMessage); // Using stderr to avoid interfering with stdout JSON communication
  }
  
  // Log to file if enabled
  if (CONFIG.logFile) {
    try {
      fs.appendFileSync(CONFIG.logFile, logMessage);
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
  }
}

/**
 * Initializes the server and sets up event handlers
 */
function initialize() {
  log(`Cursor & Claude Think MCP starting (version ${CONFIG.version})`);
  
  // Send server information to Cursor
  console.log(JSON.stringify({
    jsonrpc: "2.0",
    method: "mcp/server_info",
    params: {
      name: "Cursor-Claud-Think-MCP",
      version: CONFIG.version,
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
      // Skip empty lines
      if (!line.trim()) return;
      
      log(`Received request: ${line}`);
      const request = JSON.parse(line);
      
      if (request.method === "mcp/execute") {
        handleExecute(request);
      } else {
        log(`Unknown method: ${request.method}`, 'warn');
      }
    } catch (error) {
      log(`Error processing request: ${error.message}`, 'error');
      log(`Problematic line: ${line}`, 'error');
      
      // Try to extract ID from the request to send proper error response
      let id = null;
      try {
        const partialRequest = JSON.parse(line);
        id = partialRequest.id;
      } catch {
        // If we can't parse the JSON at all, we can't send a proper response
      }
      
      if (id) {
        sendErrorResponse(id, -32700, "Parse error");
      }
    }
  });

  // Set up error handlers
  rl.on('error', (error) => {
    log(`Readline error: ${error.message}`, 'error');
  });

  // Handle process events
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  process.on('uncaughtException', (error) => {
    log(`Uncaught exception: ${error.message}`, 'error');
    log(error.stack, 'error');
    gracefulShutdown();
  });
}

/**
 * Gracefully shuts down the MCP server
 */
function gracefulShutdown() {
  log('MCP server shutting down', 'info');
  rl.close();
  process.exit(0);
}

/**
 * Escapes HTML tags in a string
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Handles execute requests from Cursor
 * @param {Object} request - The JSON-RPC request
 */
function handleExecute(request) {
  const { id, params } = request;
  
  if (!params) {
    return sendErrorResponse(id, -32602, "Invalid params");
  }
  
  const { tool, arguments: args } = params;

  if (tool === "think") {
    if (!args || !args.prompt) {
      return sendErrorResponse(id, -32602, "Missing required parameter: prompt");
    }
    
    const prompt = args.prompt.trim();
    
    if (!prompt) {
      return sendErrorResponse(id, -32602, "Prompt cannot be empty");
    }
    
    log(`Processing 'think' request for prompt: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`);
    
    // Format the thinking prompt with special markers
    const thinkingResponse = {
      jsonrpc: "2.0",
      id: id,
      result: {
        output: formatThinkingPrompt(prompt)
      }
    };
    
    console.log(JSON.stringify(thinkingResponse));
    log("Response sent successfully");
  } else {
    log(`Unknown tool requested: ${tool}`, 'warn');
    sendErrorResponse(id, -32601, `Tool "${tool}" not found`);
  }
}

/**
 * Sends an error response for the given request ID
 * @param {string|number} id - The request ID
 * @param {number} code - The error code
 * @param {string} message - The error message
 */
function sendErrorResponse(id, code, message) {
  log(`Sending error response: ${message}`, 'error');
  console.log(JSON.stringify({
    jsonrpc: "2.0",
    id: id,
    error: {
      code: code,
      message: message
    }
  }));
}

/**
 * Formats the thinking prompt with the appropriate structure
 * @param {string} prompt - The user's prompt
 * @returns {string} The formatted thinking prompt
 */
function formatThinkingPrompt(prompt) {
  // Escape HTML tags in the prompt to prevent injection issues
  const escapedPrompt = escapeHtml(prompt);
  
  return `<thinking>
Think extraordinarily deeply about this problem.
Break this down step-by-step, showing all your reasoning.
Consider multiple alternative approaches before deciding.
Explicitly identify and examine your assumptions.
Look for edge cases and potential failure modes.
Evaluate trade-offs between different solutions.
Challenge your initial intuitions with counterarguments.
Synthesize your insights before delivering a conclusion.

${escapedPrompt}
</thinking>

[After careful analysis, provide your final answer here]`;
}

// Only run the server when this file is executed directly
if (require.main === module) {
  initialize();
}

// Export functions for testing
module.exports = {
  formatThinkingPrompt,
  handleExecute,
  sendErrorResponse,
  escapeHtml,
  log
}; 