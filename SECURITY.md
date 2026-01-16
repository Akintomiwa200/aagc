# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public GitHub issue
2. Email security details to: security@aagc.org
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity

## Security Best Practices

### For Users

- Keep dependencies updated
- Use strong passwords
- Enable 2FA when available
- Never commit `.env` files
- Use HTTPS in production
- Regularly rotate API keys

### For Developers

- Follow secure coding practices
- Validate all user inputs
- Use parameterized queries
- Implement rate limiting
- Use HTTPS only
- Keep dependencies updated
- Regular security audits

## Known Security Considerations

- OAuth tokens should be validated server-side
- JWT secrets must be strong and rotated
- Database credentials must be secured
- API keys should never be exposed client-side
- CORS should be properly configured

## Security Updates

Security updates will be announced via:
- GitHub Security Advisories
- Release notes
- Email notifications (for critical issues)

Thank you for helping keep Apostolic Army Global Church secure!

