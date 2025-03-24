#!/usr/bin/env node

/**
 * Global Installation Script for Cursor & Claude Think MCP
 * 
 * This script automates the process of installing the Cursor & Claude Think MCP
 * globally on your system, setting up the necessary configuration for Cursor.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Configuration
const HOME_DIR = os.homedir();
const CURSOR_CONFIG_DIR = path.join(HOME_DIR, '.cursor');
const TOOL_INSTALL_DIR = path.join(HOME_DIR, 'cursor-claud-think-mcp');
const TOOL_SOURCE = path.join(__dirname, '..', 'src', 'think-tool.js');
const TOOL_DEST = path.join(TOOL_INSTALL_DIR, 'think-tool.js');
const MCP_CONFIG_FILE = path.join(CURSOR_CONFIG_DIR, 'mcp.json');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

/**
 * Logs a colorful message to the console
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Creates a directory if it doesn't exist
 */
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    log(`Creating directory: ${dir}`, colors.blue);
    fs.mkdirSync(dir, { recursive: true });
    return true;
  }
  return false;
}

/**
 * Copies the tool script to the destination
 */
function copyToolScript() {
  log('Copying think-tool.js to installation directory...', colors.blue);
  
  try {
    fs.copyFileSync(TOOL_SOURCE, TOOL_DEST);
    
    // Make the script executable on Unix-like systems
    if (os.platform() !== 'win32') {
      fs.chmodSync(TOOL_DEST, '755');
    }
    
    log('Tool script copied successfully!', colors.green);
    return true;
  } catch (error) {
    log(`Error copying tool script: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Creates or updates the MCP configuration file
 */
function configureMCP() {
  log('Configuring MCP settings...', colors.blue);
  
  try {
    // Check if config already exists
    let config = { mcpServers: {} };
    
    if (fs.existsSync(MCP_CONFIG_FILE)) {
      try {
        const existingConfig = fs.readFileSync(MCP_CONFIG_FILE, 'utf8');
        config = JSON.parse(existingConfig);
        log('Existing MCP configuration found, updating...', colors.yellow);
      } catch (error) {
        log(`Warning: Could not parse existing MCP config, creating new one: ${error.message}`, colors.yellow);
      }
    }
    
    // Update the config with our tool
    config.mcpServers = config.mcpServers || {};
    config.mcpServers['Cursor-Claud-Think-MCP'] = {
      command: 'node',
      args: [TOOL_DEST.replace(/\\/g, '\\\\')]  // Ensure Windows paths are properly escaped
    };
    
    // Write the updated config
    fs.writeFileSync(MCP_CONFIG_FILE, JSON.stringify(config, null, 2));
    
    log('MCP configuration updated successfully!', colors.green);
    return true;
  } catch (error) {
    log(`Error configuring MCP: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Main installation function
 */
function install() {
  log('\n🔧 Installing Cursor & Claude Think MCP globally...\n', colors.blue);
  
  // Create necessary directories
  ensureDirectoryExists(CURSOR_CONFIG_DIR);
  ensureDirectoryExists(TOOL_INSTALL_DIR);
  
  // Copy the tool script
  const scriptCopied = copyToolScript();
  if (!scriptCopied) {
    log('Failed to copy tool script, aborting installation.', colors.red);
    process.exit(1);
  }
  
  // Configure MCP
  const mcpConfigured = configureMCP();
  if (!mcpConfigured) {
    log('Failed to configure MCP, aborting installation.', colors.red);
    process.exit(1);
  }
  
  // Installation complete
  log('\n✅ Cursor & Claude Think MCP installed successfully!', colors.green);
  log('\n⚠️  IMPORTANT: You must restart Cursor for the changes to take effect.', colors.yellow);
  log('\n📘 Usage: In any Cursor chat, type "think" followed by your question.', colors.blue);
  log('  Example: think What is the computational complexity of quicksort?', colors.blue);
}

// Run the installation
install(); 