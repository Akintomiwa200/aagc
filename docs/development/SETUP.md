# Development Setup Guide

Complete guide for setting up the development environment.

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **MongoDB**: 6.0 or higher (or use Docker)
- **Git**: Latest version
- **Code Editor**: VS Code recommended

## Quick Start with Docker

The easiest way to get started:

```bash
# Clone repository
git clone https://github.com/your-org/aagc-platform.git
cd aagc-platform

# Start all services
docker-compose up
```

This will start:
- MongoDB on port 27017
- Backend API on port 3001
- Frontend on port 3000

## Manual Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/aagc-platform.git
cd aagc-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# At minimum, set MONGO_URI

# Start MongoDB (if local)
# Or use MongoDB Atlas

# Run development server
npm run start:dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your configuration

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Mobile Setup

```bash
cd mobile

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration

# Run development server
npm run dev
```

Mobile will run on `http://localhost:5173`

## Database Setup

### Option 1: Local MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in backend `.env`

## Environment Variables

See `.env.example` files in each directory for required variables.

### Minimum Required

**Backend:**
- `MONGO_URI`
- `FRONTEND_URL`

**Frontend:**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`

**Mobile:**
- `VITE_API_URL`
- `VITE_SOCKET_URL`

## Development Workflow

1. **Start MongoDB** (if local)
2. **Start Backend**: `cd backend && npm run start:dev`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Start Mobile**: `cd mobile && npm run dev` (optional)

## VS Code Setup

### Recommended Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- MongoDB for VS Code

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Common Issues

### Port Already in Use

```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error

- Check MongoDB is running
- Verify connection string
- Check firewall settings

### Module Not Found

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Debugging

### Backend

```bash
npm run start:debug
```

Attach debugger on port 9229

### Frontend

Use React DevTools and Next.js DevTools

## Code Quality

```bash
# Lint
npm run lint

# Format
npm run format
```

## Git Workflow

1. Create feature branch
2. Make changes
3. Commit with conventional commits
4. Push and create PR

## Need Help?

- Check [Troubleshooting](../README.md#-troubleshooting)
- Open an issue on GitHub
- Contact dev team

