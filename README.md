# Claude Think Tool for Cursor

This MCP (Model Context Protocol) tool enables Claude's explicit thinking mode in Cursor, allowing you to see Claude's step-by-step reasoning process.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [Cursor](https://cursor.sh/) (v0.9.0 or higher)
- Basic knowledge of terminal commands

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
   ```bash
   mkdir -p ~/.cursor
   ```

2. Copy the tool and configuration:
   ```bash
   # Create the destination directory
   mkdir -p ~/claude-think-tool
   
   # Copy the tool
   cp src/think-tool.js ~/claude-think-tool/
   
   # Make it executable
   chmod +x ~/claude-think-tool/think-tool.js
   
   # Create the global MCP configuration with absolute path (more reliable)
   echo "{\"mcpServers\":{\"claude-think-tool\":{\"command\":\"node\",\"args\":[\"$HOME/claude-think-tool/think-tool.js\"]}}}" > ~/.cursor/mcp.json
   ```

3. **Restart Cursor** to apply the changes (required)

### Windows Installation

For Windows users:

1. Create the Cursor configuration directory:
   ```powershell
   mkdir -p $env:USERPROFILE\.cursor
   ```

2. Copy the tool:
   ```powershell
   mkdir -p $env:USERPROFILE\claude-think-tool
   copy src\think-tool.js $env:USERPROFILE\claude-think-tool\
   ```

3. Create the global MCP configuration:
   ```powershell
   echo "{\"mcpServers\":{\"claude-think-tool\":{\"command\":\"node\",\"args\":[\"$env:USERPROFILE\\claude-think-tool\\think-tool.js\"]}}}" > $env:USERPROFILE\.cursor\mcp.json
   ```

4. **Restart Cursor** to apply the changes (required)

## Usage

In any Cursor chat, simply type:
```
think What is the computational complexity of quicksort?
```

**Important Usage Notes:**
- The word "think" must be at the beginning of your message followed by a space
- Everything after "think " will be processed by Claude in its special thinking mode
- The tool will not activate if "think" appears elsewhere in your message
- No formatting or special characters are needed - just start with "think "

## Examples

See the [examples directory](./examples/) for sample use cases:

- Complex problem solving
- Mathematical proofs
- Decision making processes
- Code algorithm analysis

## Troubleshooting

If the tool doesn't appear to be working:

1. Make sure Cursor has been restarted after installation
2. Check that Node.js is installed by running `node --version` in your terminal
3. Verify that the path in the MCP configuration is correct and points to the script
4. Ensure the script is executable (`chmod +x` on Unix systems)
5. Look for any errors in the Cursor Developer Console

For Windows users, ensure PowerShell or CMD is running with appropriate permissions.

## How It Works Technically

This tool uses the Model Context Protocol to:
1. Intercept when you type "think" in the chat
2. Format your question with special `<thinking>` tags
3. Return the formatted prompt to Claude
4. Claude recognizes these tags and enters explicit reasoning mode

The `<thinking>` tags signal to Claude to show its reasoning process explicitly.

## Security Considerations

- The tool doesn't access or transmit any sensitive information
- It runs locally on your machine and only processes the text you send to Claude
- See [SECURITY.md](./SECURITY.md) for vulnerability reporting guidelines

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the terms in [LICENSE](./LICENSE). 