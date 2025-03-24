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
const TOOL_INSTALL_DIR = path.join(HOME_DIR, 'cursor-claude-think-mcp');
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
      
      // Verify executable permissions
      const stats = fs.statSync(TOOL_DEST);
      const isExecutable = !!(stats.mode & fs.constants.S_IXUSR);
      
      if (!isExecutable) {
        log('Warning: Could not set executable permissions. Try running: chmod +x ' + TOOL_DEST, colors.yellow);
      } else {
        log('Executable permissions set successfully.', colors.green);
      }
    }
    
    // Verify the script exists and is readable
    try {
      const content = fs.readFileSync(TOOL_DEST, 'utf8');
      if (!content.includes('Cursor-Claude-Think-MCP')) {
        log('Warning: The tool file may not contain the correct server name.', colors.yellow);
      }
    } catch (err) {
      log(`Warning: Could not verify the tool file content: ${err.message}`, colors.yellow);
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
    config.mcpServers['Cursor-Claude-Think-MCP'] = {
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
 * Verifies the installation
 */
function verifyInstallation() {
  log('Verifying installation...', colors.blue);
  
  try {
    // Check if the tool script exists
    if (!fs.existsSync(TOOL_DEST)) {
      log('Tool script not found at: ' + TOOL_DEST, colors.red);
      return false;
    }
    
    // Check if MCP config exists
    if (!fs.existsSync(MCP_CONFIG_FILE)) {
      log('MCP configuration file not found at: ' + MCP_CONFIG_FILE, colors.red);
      return false;
    }
    
    // Read MCP config
    try {
      const configContent = fs.readFileSync(MCP_CONFIG_FILE, 'utf8');
      const config = JSON.parse(configContent);
      
      if (!config.mcpServers || !config.mcpServers['Cursor-Claude-Think-MCP']) {
        log('MCP configuration does not contain the tool entry.', colors.red);
        return false;
      }
      
      const toolConfig = config.mcpServers['Cursor-Claude-Think-MCP'];
      if (toolConfig.command !== 'node' || !toolConfig.args || !toolConfig.args[0]) {
        log('MCP tool configuration appears to be invalid.', colors.red);
        return false;
      }
      
      if (!fs.existsSync(toolConfig.args[0].replace(/\\\\/g, '\\'))) {
        log('The tool path in MCP configuration does not exist: ' + toolConfig.args[0], colors.red);
        return false;
      }
      
      log('MCP configuration verified successfully!', colors.green);
      return true;
    } catch (error) {
      log(`Error parsing MCP configuration: ${error.message}`, colors.red);
      return false;
    }
  } catch (error) {
    log(`Error verifying installation: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Creates the project-level MCP configuration
 */
function createProjectMCP() {
  log('Setting up project-level MCP configuration...', colors.blue);
  
  try {
    // Determine the project root directory (one level up from scripts directory)
    const projectRoot = path.join(__dirname, '..');
    const cursorDir = path.join(projectRoot, '.cursor');
    const projectMcpFile = path.join(cursorDir, 'mcp.json');
    
    // Create .cursor directory if it doesn't exist
    if (!fs.existsSync(cursorDir)) {
      fs.mkdirSync(cursorDir, { recursive: true });
    }
    
    // Create the project MCP configuration
    const projectConfig = {
      mcpServers: {
        'Cursor-Claude-Think-MCP': {
          command: 'node',
          args: [path.join(projectRoot, 'src', 'think-tool.js')]
        }
      }
    };
    
    // Write the configuration file
    fs.writeFileSync(projectMcpFile, JSON.stringify(projectConfig, null, 2));
    
    log('Project-level MCP configuration created successfully!', colors.green);
    return true;
  } catch (error) {
    log(`Error creating project MCP configuration: ${error.message}`, colors.red);
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
  
  // Create project-level MCP configuration
  createProjectMCP();
  
  // Verify installation
  const installationVerified = verifyInstallation();
  if (!installationVerified) {
    log('Installation verification failed. The tool may not work correctly.', colors.yellow);
  } else {
    log('Installation verification passed!', colors.green);
  }
  
  // Installation complete
  log('\n✅ Cursor & Claude Think MCP installed successfully!', colors.green);
  log('\n⚠️  IMPORTANT: You must restart Cursor for the changes to take effect.', colors.yellow);
  log('\n📘 Usage: In any Cursor chat, type "think" followed by your question.', colors.blue);
  log('  Example: think What is the computational complexity of quicksort?', colors.blue);
}

// Run the installation
install(); 