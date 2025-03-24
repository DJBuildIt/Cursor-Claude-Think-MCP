#!/usr/bin/env node

// Test script for Claude Think Tool MCP server
// This simulates how Cursor would interact with the MCP server

const { spawn } = require('child_process');
const path = require('path');

// Path to the MCP server script
const mcpServerPath = path.join(__dirname, 'think-tool.js');

// Spawn the MCP server process
const mcpServer = spawn('node', [mcpServerPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Handle server output
mcpServer.stdout.on('data', (data) => {
  const message = data.toString().trim();
  
  try {
    const json = JSON.parse(message);
    
    if (json.method === 'mcp/server_info') {
      console.log('✅ Server successfully initialized');
      console.log('Server name:', json.params.name);
      console.log('Tools:', json.params.tools.map(t => t.name).join(', '));
      
      // Send a test request to the server
      const testRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'mcp/execute',
        params: {
          tool: 'think',
          arguments: {
            prompt: 'How does quicksort work?'
          }
        }
      };
      
      mcpServer.stdin.write(JSON.stringify(testRequest) + '\n');
    } else if (json.id === 1 && json.result) {
      console.log('✅ Server successfully responded to think request');
      console.log('\nOutput:');
      console.log('-------');
      console.log(json.result.output);
      console.log('-------\n');
      
      // Test complete, exit
      mcpServer.kill();
      process.exit(0);
    }
  } catch (error) {
    console.error('Error parsing server output:', error.message);
    console.error('Raw output:', message);
  }
});

// Handle server errors
mcpServer.stderr.on('data', (data) => {
  console.error('Server error:', data.toString().trim());
});

// Handle process exit
mcpServer.on('close', (code) => {
  if (code !== 0) {
    console.error(`Server exited with code ${code}`);
  }
});

console.log('🔍 Testing Claude Think Tool MCP server...'); 