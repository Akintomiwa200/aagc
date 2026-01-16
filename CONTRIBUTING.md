# Contributing to Apostolic Army Global Church

Thank you for your interest in contributing to the Apostolic Army Global Church Platform! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-org/aagc-platform/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Commit with conventional commits format
7. Push to your fork
8. Open a Pull Request

## Development Setup

See [README.md](README.md) for installation instructions.

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define types for all functions and variables
- Avoid `any` type
- Use interfaces for object shapes

### Code Style

- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add prayer request real-time updates
fix: resolve authentication token expiration
docs: update API documentation
style: format code with prettier
refactor: reorganize user service
test: add unit tests for prayers module
chore: update dependencies
```

### File Naming

- Components: PascalCase (e.g., `PrayerCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL.ts`)

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for >80% code coverage

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update API documentation for endpoint changes

## Review Process

1. All PRs require at least one approval
2. CI checks must pass
3. Code review feedback must be addressed
4. Maintainer will merge when ready

## Questions?

Feel free to open an issue or contact the maintainers.

Thank you for contributing! 🙏

