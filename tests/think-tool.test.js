/**
 * Tests for the Cursor & Claude Think MCP
 * 
 * These tests verify that the tool correctly formats thinking prompts
 * and handles JSON-RPC requests properly.
 */

// Mock the process.stdout and process.stderr to capture output
let stdoutMock = '';
let stderrMock = '';

// Original write functions
const originalStdoutWrite = process.stdout.write;
const originalStderrWrite = process.stderr.write;

// Setup and teardown for tests
beforeEach(() => {
  // Reset captured output
  stdoutMock = '';
  stderrMock = '';
  
  // Mock stdout and stderr
  process.stdout.write = jest.fn((data) => {
    stdoutMock += data.toString();
    return true;
  });
  
  process.stderr.write = jest.fn((data) => {
    stderrMock += data.toString();
    return true;
  });
});

afterEach(() => {
  // Restore original functions
  process.stdout.write = originalStdoutWrite;
  process.stderr.write = originalStderrWrite;
});

// Import the functions for testing
const formatThinkingPrompt = require('../src/think-tool').formatThinkingPrompt;
const handleExecute = require('../src/think-tool').handleExecute;

describe('formatThinkingPrompt', () => {
  test('formats a prompt with thinking tags', () => {
    const prompt = 'What is the time complexity of quicksort?';
    const formatted = formatThinkingPrompt(prompt);
    
    // Check that the formatted prompt contains the thinking tags
    expect(formatted).toContain('<thinking>');
    expect(formatted).toContain('</thinking>');
    
    // Check that the original prompt is included
    expect(formatted).toContain(prompt);
    
    // Check structure
    expect(formatted).toMatch(/^<thinking>[\s\S]*<\/thinking>[\s\S]*$/);
  });
  
  test('handles empty prompts gracefully', () => {
    const formatted = formatThinkingPrompt('');
    
    // Should still return a properly formatted string
    expect(formatted).toContain('<thinking>');
    expect(formatted).toContain('</thinking>');
  });
  
  test('escapes any HTML-like tags in the prompt', () => {
    const prompt = 'Is <div> an HTML tag?';
    const formatted = formatThinkingPrompt(prompt);
    
    // Should escape the HTML tags in the prompt
    expect(formatted).toContain('Is &lt;div&gt; an HTML tag?');
  });
});

describe('handleExecute', () => {
  test('handles a valid think request', () => {
    const request = {
      jsonrpc: '2.0',
      id: '123',
      method: 'mcp/execute',
      params: {
        tool: 'think',
        arguments: {
          prompt: 'What is the time complexity of quicksort?'
        }
      }
    };
    
    handleExecute(request);
    
    // Check that the response is valid JSON
    const response = JSON.parse(stdoutMock);
    
    // Check response structure
    expect(response.jsonrpc).toBe('2.0');
    expect(response.id).toBe('123');
    expect(response.result).toBeDefined();
    expect(response.result.output).toBeDefined();
    expect(response.result.output).toContain('What is the time complexity of quicksort?');
  });
  
  test('handles missing prompt parameter', () => {
    const request = {
      jsonrpc: '2.0',
      id: '123',
      method: 'mcp/execute',
      params: {
        tool: 'think',
        arguments: {}
      }
    };
    
    handleExecute(request);
    
    // Check that the response is valid JSON
    const response = JSON.parse(stdoutMock);
    
    // Check error response structure
    expect(response.jsonrpc).toBe('2.0');
    expect(response.id).toBe('123');
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32602);
    expect(response.error.message).toContain('Missing required parameter');
  });
  
  test('handles unknown tool', () => {
    const request = {
      jsonrpc: '2.0',
      id: '123',
      method: 'mcp/execute',
      params: {
        tool: 'unknown',
        arguments: {}
      }
    };
    
    handleExecute(request);
    
    // Check that the response is valid JSON
    const response = JSON.parse(stdoutMock);
    
    // Check error response structure
    expect(response.jsonrpc).toBe('2.0');
    expect(response.id).toBe('123');
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32601);
    expect(response.error.message).toContain('Tool "unknown" not found');
  });
}); 