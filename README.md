# Apostolic Army Global Church (AAGC) Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![NestJS](https://img.shields.io/badge/NestJS-11+-red.svg)
![React](https://img.shields.io/badge/React-19+-blue.svg)

**A comprehensive, real-time church management and community engagement platform**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API Reference](#-api-reference) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Real-Time Features](#-real-time-features)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Overview

AAGC Platform is a full-stack, real-time church management system designed to enhance community engagement, streamline administrative tasks, and provide an immersive digital experience for members, visitors, and administrators.

### Key Capabilities

- **Real-Time Updates**: WebSocket-powered live updates across all platforms
- **Multi-Platform**: Web admin dashboard, public website, and mobile app
- **OAuth Authentication**: Google and Apple Sign-In support
- **Comprehensive Management**: Members, events, sermons, prayers, donations, and more
- **Modern Stack**: Built with NestJS, Next.js, React, TypeScript, and MongoDB

### Use Cases

- **Church Administrators**: Manage members, events, sermons, and donations
- **Church Members**: Access sermons, events, submit prayer requests, give online
- **Visitors**: Register as first-timers, explore events, watch sermons
- **Mobile Users**: Full-featured mobile app with offline capabilities

---

## ✨ Features

### 🏠 Public Website
- **Hero Section**: Auto-playing image carousel with engaging CTAs
- **Event Management**: Featured events with registration and RSVP
- **Sermon Library**: Video/audio playback with search and filtering
- **Online Giving**: Secure donation processing with multiple options
- **First Timer Registration**: Comprehensive registration form with follow-up
- **Responsive Design**: Mobile-first, accessible, and SEO-optimized

### 👨‍💼 Admin Dashboard
- **Real-Time Dashboard**: Live statistics and activity feed
- **Member Management**: Complete member database with profiles
- **Prayer Requests**: Real-time prayer wall with status tracking
- **Event Management**: Create, edit, and manage church events
- **Sermon Management**: Upload, organize, and publish sermons
- **Donation Tracking**: Financial reports and donation history
- **Gallery Management**: Photo and media library
- **Reports & Analytics**: Comprehensive reporting system
- **Settings**: Church information, notifications, and preferences

### 📱 Mobile App
- **Native Experience**: Progressive Web App (PWA) with offline support
- **Real-Time Sync**: Live updates for prayers, events, and notifications
- **Social Features**: Friends, friend requests, and community engagement
- **Gamification**: XP points, badges, streaks, and leaderboards
- **AI Features**: Prophetic prayer generation and image creation
- **Devotional**: Daily devotionals with Bible reading plans
- **Notes**: Personal notes and journaling
- **Live Meetings**: Real-time meeting participation

### 🔐 Authentication & Security
- **OAuth Integration**: Google and Apple Sign-In
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Admin, staff, and member roles
- **Password Hashing**: bcrypt encryption
- **CORS Protection**: Configured for secure cross-origin requests

### ⚡ Real-Time Features
- **Live Updates**: Prayer requests, events, and notifications
- **WebSocket Gateway**: Socket.IO for bidirectional communication
- **Dashboard Stats**: Real-time statistics updates
- **Activity Feed**: Live activity stream
- **Notifications**: Push notifications support

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Applications                     │
├──────────────┬──────────────┬──────────────────────────────┤
│   Frontend   │   Mobile     │      Admin Dashboard         │
│   (Next.js)  │   (React)    │      (Next.js)               │
└──────┬───────┴──────┬───────┴──────────────┬───────────────┘
       │              │                      │
       │  REST API    │  REST API            │  REST API
       │  WebSocket   │  WebSocket           │  WebSocket
       └──────┬───────┴──────────┬───────────┘
              │                  │
       ┌──────▼──────────────────▼──────┐
       │      Backend API (NestJS)       │
       │  ┌──────────────────────────┐  │
       │  │   WebSocket Gateway      │  │
       │  │   (Socket.IO)             │  │
       │  └──────────────────────────┘  │
       │  ┌──────────────────────────┐  │
       │  │   REST Controllers        │  │
       │  │   - Auth                  │  │
       │  │   - Prayers               │  │
       │  │   - Events                │  │
       │  │   - Sermons               │  │
       │  │   - Donations             │  │
       │  │   - Users                 │  │
       │  └──────────────────────────┘  │
       └──────────────┬─────────────────┘
                      │
              ┌───────▼────────┐
              │   MongoDB       │
              │   Database      │
              └─────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) 11+
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Real-Time**: [Socket.IO](https://socket.io/) 4.8+
- **Authentication**: Passport.js with OAuth strategies
- **Validation**: class-validator, class-transformer
- **Security**: bcrypt, JWT (to be implemented)

### Frontend (Public & Admin)
- **Framework**: [Next.js](https://nextjs.org/) 16+ (App Router)
- **UI Library**: React 19+
- **Styling**: Tailwind CSS 4+
- **Components**: shadcn/ui, Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod
- **Real-Time**: Socket.IO Client

### Mobile
- **Framework**: React 19+ with Vite
- **Routing**: React Router DOM 7+
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Real-Time**: Socket.IO Client
- **AI**: Google Gemini API

### Development Tools
- **Language**: TypeScript 5+
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest (backend), Vitest (frontend/mobile)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **MongoDB**: 6.0 or higher (local or Atlas)
- **npm/yarn/pnpm**: Package manager
- **Git**: Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/aagc-platform.git
   cd aagc-platform
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   
   # Mobile
   cd ../mobile
   npm install
   ```

3. **Set up environment variables**
   
   See [Configuration](#-configuration) section for detailed environment setup.

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or use MongoDB Atlas (cloud)
   ```

5. **Run development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run start:dev
   # Server runs on http://localhost:3001
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:3000
   ```
   
   **Terminal 3 - Mobile:**
   ```bash
   cd mobile
   npm run dev
   # App runs on http://localhost:5173
   ```

6. **Access the applications**
   - Public Website: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - Mobile App: http://localhost:5173
   - API: http://localhost:3001/api

---

## 📁 Project Structure

```
aagc-platform/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication & OAuth
│   │   │   ├── users/         # User management
│   │   │   ├── prayers/       # Prayer requests
│   │   │   ├── events/        # Events management
│   │   │   ├── sermons/       # Sermon library
│   │   │   ├── donations/     # Donations & giving
│   │   │   └── websocket/     # Real-time gateway
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts          # Entry point
│   ├── test/                  # E2E tests
│   ├── .env.example           # Environment template
│   └── package.json
│
├── frontend/                  # Next.js Public Website & Admin
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── admin/         # Admin dashboard
│   │   │   ├── events/        # Public events
│   │   │   ├── sermons/       # Public sermons
│   │   │   └── ...
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts (Auth, Socket)
│   │   ├── lib/               # Utilities
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   ├── .env.example
│   └── package.json
│
├── mobile/                    # React Mobile App
│   ├── pages/                 # App pages
│   ├── components/            # Reusable components
│   ├── context/               # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── services/              # API services
│   ├── .env.example
│   └── package.json
│
├── docs/                      # Documentation
│   ├── api/                   # API documentation
│   ├── deployment/            # Deployment guides
│   └── development/           # Development guides
│
├── .gitignore                 # Git ignore rules
├── LICENSE                    # MIT License
├── CONTRIBUTING.md            # Contribution guidelines
├── SECURITY.md                # Security policy
├── CHANGELOG.md               # Version history
└── README.md                  # This file
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/aagc
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aagc

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# OAuth - Apple
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=./path/to/private-key.p8

# JWT (for production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CHURCH_NAME="Apostolic Army Global Church"
NEXT_PUBLIC_CHURCH_EMAIL=info@aagc.org
NEXT_PUBLIC_CHURCH_PHONE="+234 123 456 7890"

# OAuth (if using client-side OAuth)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Mobile Environment Variables

Create `mobile/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001

# Google Gemini AI (optional)
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### POST `/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin"
  }
}
```

#### POST `/auth/oauth/mobile`
OAuth login for mobile apps.

**Request:**
```json
{
  "provider": "google",
  "token": "oauth-token",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://..."
}
```

#### GET `/auth/google`
Initiate Google OAuth flow (web).

#### GET `/auth/apple`
Initiate Apple OAuth flow (web).

### Prayer Endpoints

#### GET `/prayers`
Get all prayer requests.

#### GET `/prayers/stats`
Get prayer statistics.

**Response:**
```json
{
  "total": 150,
  "pending": 45,
  "ongoing": 60,
  "answered": 45
}
```

#### POST `/prayers`
Create a new prayer request.

**Request:**
```json
{
  "name": "John Doe",
  "request": "Prayer request text",
  "email": "john@example.com",
  "isAnonymous": false
}
```

#### PUT `/prayers/:id/status`
Update prayer status.

**Request:**
```json
{
  "status": "answered"
}
```

#### DELETE `/prayers/:id`
Delete a prayer request.

### Event Endpoints

#### GET `/events`
Get all events.

#### GET `/events/:id`
Get a specific event.

#### POST `/events`
Create a new event.

### Sermon Endpoints

#### GET `/sermons`
Get all sermons.

#### GET `/sermons/:id`
Get a specific sermon.

### Donation Endpoints

#### POST `/donations`
Create a donation.

**Request:**
```json
{
  "userId": "user-id",
  "type": "Tithe",
  "amount": 100.00,
  "paymentMethod": "card"
}
```

#### GET `/donations?userId=user-id`
Get user's donation history.

### User Endpoints

#### GET `/users/:id`
Get user profile.

#### PUT `/users/:id`
Update user profile.

---

## ⚡ Real-Time Features

### WebSocket Events

The platform uses Socket.IO for real-time communication.

#### Client → Server Events

- `join-room`: Join a specific room (e.g., 'prayers', 'events')
- `leave-room`: Leave a room

#### Server → Client Events

- `initial-data`: Sent on connection with initial data
- `prayer-created`: New prayer request created
- `prayer-updated`: Prayer request updated
- `prayer-deleted`: Prayer request deleted
- `event-created`: New event created
- `event-updated`: Event updated
- `dashboard-update`: Dashboard statistics updated

### Example Usage

**Frontend/Mobile:**
```typescript
import { useSocket } from '@/contexts/SocketContext';

const { socket, isConnected } = useSocket();

useEffect(() => {
  if (!socket || !isConnected) return;

  socket.on('prayer-created', (data) => {
    console.log('New prayer:', data.prayer);
    // Update UI
  });

  return () => {
    socket.off('prayer-created');
  };
}, [socket, isConnected]);
```

---

## 💻 Development

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with NestJS and Next.js rules
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### Running in Development

```bash
# Backend with hot reload
cd backend && npm run start:dev

# Frontend with hot reload
cd frontend && npm run dev

# Mobile with hot reload
cd mobile && npm run dev
```

### Building for Production

```bash
# Backend
cd backend && npm run build && npm run start:prod

# Frontend
cd frontend && npm run build && npm start

# Mobile
cd mobile && npm run build
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## 🚢 Deployment

### Backend Deployment

#### Using PM2

```bash
npm run build
pm2 start dist/main.js --name aagc-backend
```

#### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

### Frontend Deployment

#### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

#### Other Platforms

- **Netlify**: Full Next.js support
- **AWS Amplify**: Serverless deployment
- **Digital Ocean**: App Platform
- **Self-hosted**: Docker or PM2

### Mobile Deployment

Build as PWA and deploy to:
- **Vercel/Netlify**: Static hosting
- **App Stores**: Wrap as native app with Capacitor/Cordova

---

## 🔒 Security

### Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Tokens**: Use strong secrets, set expiration
3. **Password Hashing**: Always use bcrypt
4. **CORS**: Configure allowed origins
5. **Rate Limiting**: Implement rate limiting (recommended)
6. **HTTPS**: Always use HTTPS in production
7. **Input Validation**: Validate all inputs
8. **SQL Injection**: Use parameterized queries (MongoDB handles this)

### Reporting Security Issues

See [SECURITY.md](SECURITY.md) for security reporting guidelines.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct

Please be respectful and follow our code of conduct.

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Check MongoDB is running
mongosh

# Or restart MongoDB
docker restart mongodb
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### WebSocket Connection Failed
- Check CORS configuration
- Verify Socket.IO URL
- Check firewall settings

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Development**: [Team Members]
- **Frontend Development**: [Team Members]
- **Mobile Development**: [Team Members]
- **Design**: [Designer Name]

---

## 📞 Support

- **Email**: support@aagc.org
- **Website**: https://aagc.org
- **GitHub Issues**: [Create an issue](https://github.com/your-org/aagc-platform/issues)
- **Documentation**: [Full Documentation](https://docs.aagc.org)

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.IO](https://socket.io/) - Real-time engine
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide Icons](https://lucide.dev/) - Icon library

---

<div align="center">

**Built with ❤️ for the Kingdom**

*Last Updated: December 2024*

[⬆ Back to Top](#-table-of-contents)

</div>
