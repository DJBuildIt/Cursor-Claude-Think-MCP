# Security Policy

## Supported Versions

Only the latest version of Cursor & Claude Think MCP is currently supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in the Cursor & Claude Think MCP, please follow these steps:

1. **Do Not** disclose the vulnerability publicly until it has been addressed.
2. Submit your report via GitHub's Security Advisory feature or send an email to [security@example.com](mailto:security@example.com) with the following information:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggestions for remediation, if any

3. You should receive a response within 48 hours acknowledging receipt of your report.
4. We will keep you informed about the progress of addressing the vulnerability.
5. Once the vulnerability is fixed, we will credit you (if desired) in the release notes.

## Security Considerations

The Cursor & Claude Think MCP:
- Runs locally on your machine
- Does not send or receive data beyond your local Cursor instance
- Only processes the text prompts you explicitly provide
- Does not have access to files outside its scope
- Uses standard Node.js libraries with no external dependencies

## Best Practices

When using this tool:
- Keep your Node.js installation up to date
- Verify script integrity after downloading
- Do not modify the tool script unless you understand the implications
- Do not run the tool with elevated/administrator privileges

Thank you for helping keep Cursor & Claude Think MCP secure!
