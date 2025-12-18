# API Documentation

Complete API reference for AAGC Platform Backend.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST `/auth/login`
Authenticate with email and password.

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
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin"
  }
}
```

#### POST `/auth/register`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "User Name",
  "role": "member"
}
```

#### POST `/auth/oauth/mobile`
OAuth authentication for mobile apps.

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

### Prayers

#### GET `/prayers`
Get all prayer requests.

**Query Parameters:**
- `status` (optional): Filter by status (pending, ongoing, answered)

**Response:**
```json
[
  {
    "_id": "prayer-id",
    "name": "John Doe",
    "request": "Prayer request text",
    "status": "pending",
    "isAnonymous": false,
    "createdAt": "2024-12-10T10:00:00Z"
  }
]
```

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
  "phone": "+1234567890",
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

### Events

#### GET `/events`
Get all events.

**Response:**
```json
[
  {
    "_id": "event-id",
    "title": "Sunday Service",
    "date": "2024-12-15",
    "location": "Main Auditorium",
    "description": "Weekly Sunday service"
  }
]
```

#### GET `/events/:id`
Get a specific event.

#### POST `/events`
Create a new event (requires authentication).

### Sermons

#### GET `/sermons`
Get all sermons.

#### GET `/sermons/:id`
Get a specific sermon.

### Donations

#### POST `/donations`
Create a donation (requires authentication).

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

### Users

#### GET `/users/:id`
Get user profile.

#### PUT `/users/:id`
Update user profile (requires authentication).

## WebSocket Events

### Client → Server

- `join-room`: Join a room (e.g., 'prayers', 'events')
- `leave-room`: Leave a room

### Server → Client

- `initial-data`: Initial data on connection
- `prayer-created`: New prayer created
- `prayer-updated`: Prayer updated
- `prayer-deleted`: Prayer deleted
- `event-created`: New event created
- `event-updated`: Event updated
- `dashboard-update`: Dashboard stats updated

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Rate Limiting

API rate limiting will be implemented in future versions.

## Versioning

API versioning will be implemented as needed. Current version: v1.

