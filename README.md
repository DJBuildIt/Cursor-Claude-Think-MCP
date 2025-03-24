# Claude Think Tool for Cursor

This MCP (Model Context Protocol) tool enables Claude's explicit thinking mode in Cursor, allowing you to see Claude's step-by-step reasoning process.

## How It Works

When you type "think [your question]" in Cursor's chat, Claude will:
1. Enter an explicit reasoning mode
2. Show its step-by-step thinking process
3. Provide a final answer after the reasoning section

## Installation

### Project-Level Installation (Current Project Only)

The tool is already installed for this project. The configuration is in `.cursor/mcp.json`.

### Global Installation (All Projects)

To make this tool available in all your Cursor projects:

1. Create the directory for global MCP configuration:
   ```
   mkdir -p ~/.cursor
   ```

2. Copy the tool and configuration:
   ```
   # Create the destination directory
   mkdir -p ~/claude-think-tool
   
   # Copy the tool
   cp claude-think-tool/think-tool.js ~/claude-think-tool/
   
   # Make it executable
   chmod +x ~/claude-think-tool/think-tool.js
   
   # Create the global MCP configuration
   echo '{"mcpServers":{"claude-think-tool":{"command":"node","args":["~/claude-think-tool/think-tool.js"]}}}' > ~/.cursor/mcp.json
   ```

## Usage

In any Cursor chat, simply type:
```
think What is the computational complexity of quicksort?
```

Claude will enter thinking mode and show you its reasoning process before giving the final answer.

## Troubleshooting

If the tool doesn't appear to be working:

1. Make sure Cursor has been restarted after installation
2. Check that the path to the script in the MCP configuration is correct
3. Verify that the script is executable
4. Look for any errors in the Cursor Developer Console

## How It Works Technically

This tool uses the Model Context Protocol to:
1. Intercept when you type "think" in the chat
2. Format your question with special `<thinking>` tags
3. Return the formatted prompt to Claude
4. Claude recognizes these tags and enters explicit reasoning mode

The `<thinking>` tags signal to Claude to show its reasoning process explicitly. 