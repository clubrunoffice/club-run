# Club Run API Documentation

## Overview

The Club Run API provides a comprehensive backend for venue check-ins, missions, user management, and authentication. The API is built with Node.js, Express, and Prisma, featuring role-based access control and real-time WebSocket communication.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://api.yourdomain.com`

## Authentication

### JWT Token Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Google OAuth

The API supports Google OAuth for enhanced authentication:

- **POST** `/api/auth/google` - Authenticate with Google OAuth
- **GET** `/api/auth/google/callback` - OAuth callback (server-side flow)

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Google OAuth
```http
POST /api/auth/google
Content-Type: application/json

{
  "accessToken": "google_access_token",
  "userInfo": {
    "email": "user@gmail.com",
    "given_name": "John",
    "family_name": "Doe",
    "picture": "https://...",
    "id": "google_user_id"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Venues

#### Get All Venues
```http
GET /api/venues?type=bar&status=open&search=atlanta&limit=50
```

**Query Parameters:**
- `type` - Filter by venue type (bar, restaurant, club, etc.)
- `status` - Filter by status (open, closed, etc.)
- `search` - Search in name and address
- `limit` - Number of results (default: 50)

**Response:**
```json
{
  "venues": [
    {
      "id": "venue_id",
      "name": "The Local Bar",
      "address": "123 Main St",
      "city": "Atlanta",
      "state": "GA",
      "type": "bar",
      "checkInReward": 10,
      "status": "open",
      "safetyRating": 4.5,
      "avgCost": 25,
      "popularity": 150
    }
  ],
  "total": 1
}
```

#### Get Single Venue
```http
GET /api/venues/:id
```

**Response:**
```json
{
  "venue": {
    "id": "venue_id",
    "name": "The Local Bar",
    "address": "123 Main St",
    "city": "Atlanta",
    "state": "GA",
    "type": "bar",
    "checkInReward": 10,
    "status": "open",
    "safetyRating": 4.5,
    "avgCost": 25,
    "popularity": 150,
    "recentActivity": [
      {
        "id": "checkin_id",
        "timestamp": "2024-01-15T10:30:00Z",
        "user": {
          "name": "John Doe"
        }
      }
    ]
  }
}
```

#### Get Venue Analytics
```http
GET /api/venues/:id/analytics?days=30
Authorization: Bearer <token>
```

**Query Parameters:**
- `days` - Number of days for analytics (default: 30)

**Response:**
```json
{
  "analytics": {
    "totalCheckIns": 150,
    "dailyBreakdown": [
      {
        "createdAt": "2024-01-15T00:00:00Z",
        "_count": {
          "id": 5
        }
      }
    ],
    "averageRating": 4.5,
    "averageCost": 25,
    "period": "30 days"
  }
}
```

### Check-ins

#### Get User Check-ins
```http
GET /api/checkins?limit=20&offset=0&venueId=venue_id
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset (default: 0)
- `venueId` - Filter by specific venue

**Response:**
```json
{
  "checkIns": [
    {
      "id": "checkin_id",
      "venueId": "venue_id",
      "timestamp": "2024-01-15T10:30:00Z",
      "location": "Atlanta, GA",
      "notes": "Great atmosphere!",
      "photos": "https://...",
      "rating": 5,
      "isVerified": true,
      "venue": {
        "id": "venue_id",
        "name": "The Local Bar",
        "address": "123 Main St",
        "type": "bar",
        "checkInReward": 10
      }
    }
  ],
  "total": 1,
  "hasMore": false
}
```

#### Create Check-in
```http
POST /api/checkins
Authorization: Bearer <token>
Content-Type: application/json

{
  "venueId": "venue_id",
  "notes": "Amazing night!",
  "location": "Atlanta, GA",
  "photoUrl": "https://..."
}
```

**Response:**
```json
{
  "message": "Check-in successful",
  "checkIn": {
    "id": "checkin_id",
    "venueId": "venue_id",
    "timestamp": "2024-01-15T10:30:00Z",
    "notes": "Amazing night!",
    "location": "Atlanta, GA",
    "photoUrl": "https://...",
    "isVerified": true,
    "venue": {
      "id": "venue_id",
      "name": "The Local Bar",
      "address": "123 Main St",
      "type": "bar",
      "checkInReward": 10
    }
  },
  "tokensEarned": 10
}
```

#### Get Check-in Details
```http
GET /api/checkins/:id
Authorization: Bearer <token>
```

#### Update Check-in
```http
PUT /api/checkins/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Updated notes",
  "photoUrl": "https://..."
}
```

### Missions

#### Get User Missions
```http
GET /api/missions?type=daily&completed=false
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` - Filter by mission type (daily, weekly, special)
- `completed` - Filter by completion status (true/false)

**Response:**
```json
{
  "missions": {
    "daily": [
      {
        "id": "mission_id",
        "mission": {
          "id": "mission_template_id",
          "title": "Check in at 3 venues",
          "description": "Visit and check in at 3 different venues today",
          "type": "daily",
          "difficulty": "Easy",
          "reward": 50,
          "requirements": "3 check-ins"
        },
        "status": "in_progress",
        "startedAt": "2024-01-15T00:00:00Z",
        "completedAt": null
      }
    ],
    "weekly": [],
    "special": [],
    "completed": []
  },
  "stats": {
    "total": 1,
    "completed": 0,
    "active": 1,
    "totalRewards": 0
  }
}
```

#### Claim Mission Reward
```http
POST /api/missions/:id/claim
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Reward claimed successfully",
  "reward": 50,
  "mission": "Check in at 3 venues"
}
```

#### Get Available Missions
```http
GET /api/missions/available
Authorization: Bearer <token>
```

**Response:**
```json
{
  "missions": [
    {
      "id": "mission_id",
      "title": "Social Butterfly",
      "description": "Check in at 5 different venues this week",
      "type": "weekly",
      "difficulty": "Medium",
      "reward": 100,
      "requirements": "5 check-ins"
    }
  ]
}
```

#### Start Mission
```http
POST /api/missions/:id/start
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Mission started successfully",
  "userMission": {
    "id": "user_mission_id",
    "userId": "user_id",
    "missionId": "mission_id",
    "status": "assigned",
    "startedAt": "2024-01-15T10:30:00Z",
    "mission": {
      "id": "mission_id",
      "title": "Social Butterfly",
      "description": "Check in at 5 different venues this week",
      "type": "weekly",
      "difficulty": "Medium",
      "reward": 100
    }
  }
}
```

### Users

#### Get User Profile
```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "RUNNER",
    "tokenBalance": 150,
    "currentStreak": 5,
    "totalCheckIns": 25,
    "missionsCompleted": 8,
    "level": "Navigator",
    "theme": "dark",
    "badges": "early_adopter,streak_master"
  }
}
```

#### Update User Profile
```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "theme": "light"
}
```

#### Get Online Status
```http
GET /api/auth/online-status
Authorization: Bearer <privy_jwt_token>
```

**Description**: Get the current user's online availability status for receiving missions.

**Authorization**: Requires Privy JWT authentication

**Response:**
```json
{
  "isOnline": true
}
```

#### Update Online Status
```http
POST /api/auth/online-status
Authorization: Bearer <privy_jwt_token>
Content-Type: application/json

{
  "isOnline": true
}
```

**Description**: Toggle user's online availability for receiving missions. Used by the Go Online toggle in ChatBot interface.

**Authorization**: RUNNER, DJ, VERIFIED_DJ only

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| isOnline | boolean | Yes | true = go online, false = go offline |

**Success Response (200):**
```json
{
  "success": true,
  "isOnline": true,
  "lastOnlineAt": "2025-12-25T10:30:00.000Z"
}
```

**Error Response (403 - Forbidden):**
```json
{
  "error": "Only RUNNER, DJ, and VERIFIED_DJ can go online"
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

**Database Updates:**
- Updates `User.isOnline` field
- Sets `User.lastOnlineAt` to current timestamp when going online

**Frontend Integration:**
- Component: `GoOnlineToggle` in `frontend/src/components/GoOnlineToggle/`
- Location: ChatBot interface only
- See: `GO_ONLINE_SYSTEM_DOCUMENTATION.md` for full details

### Admin Endpoints

#### Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer <token>
```

#### Get System Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

### Health & Monitoring

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### API Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Club Run API is running",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "production"
}
```

## WebSocket Events

The API supports real-time communication via WebSocket connections.

### Connection
```javascript
const socket = io('http://localhost:3001');
```

### Events

#### Client to Server
- `join-user` - Join user-specific room
- `leave-user` - Leave user-specific room

#### Server to Client
- `check-in-created` - New check-in created
- `reward-claimed` - Mission reward claimed
- `mission-completed` - Mission completed
- `user-updated` - User profile updated

### Example WebSocket Usage
```javascript
// Connect to WebSocket
const socket = io('http://localhost:3001');

// Join user room
socket.emit('join-user', { userId: 'user_id' });

// Listen for check-in events
socket.on('check-in-created', (data) => {
  console.log('New check-in:', data.checkIn);
  console.log('Tokens earned:', data.tokensEarned);
});

// Listen for reward events
socket.on('reward-claimed', (data) => {
  console.log('Reward claimed:', data.mission);
  console.log('Reward amount:', data.reward);
});
```

## Error Handling

All API endpoints return consistent error responses:

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

### Rate Limiting

The API implements rate limiting:
- **General API**: 100 requests per 15 minutes
- **Authentication**: 1000 requests per 15 minutes (development)
- **Login attempts**: 5 attempts before account lockout

## Data Models

### User
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "googleId": "string?",
  "avatar": "string?",
  "role": "GUEST|RUNNER|CLIENT|OPERATIONS|PARTNER|ADMIN",
  "tokenBalance": "number",
  "currentStreak": "number",
  "totalCheckIns": "number",
  "missionsCompleted": "number",
  "level": "string",
  "theme": "string",
  "badges": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Venue
```json
{
  "id": "string",
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string?",
  "latitude": "number?",
  "longitude": "number?",
  "type": "string",
  "hours": "string",
  "phoneNumber": "string?",
  "website": "string?",
  "checkInReward": "number",
  "status": "string",
  "crowdLevel": "string",
  "safetyRating": "number",
  "avgCost": "number",
  "specialMissions": "string",
  "amenities": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### CheckIn
```json
{
  "id": "string",
  "userId": "string",
  "venueId": "string",
  "timestamp": "datetime",
  "location": "string?",
  "notes": "string?",
  "photos": "string?",
  "rating": "number?",
  "isVerified": "boolean"
}
```

### Mission
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "type": "string",
  "difficulty": "Easy|Medium|Hard",
  "reward": "number",
  "requirements": "string",
  "deadline": "datetime?",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Development

### Running Locally
```bash
# Install dependencies
npm install
cd backend && npm install

# Set up environment
cp backend/env.example backend/.env

# Start development server
npm run dev
```

### Testing
```bash
# Run tests
npm test

# Run specific test
npm test -- --grep "auth"
```

## Production Deployment

See `deploy-production.sh` for automated production deployment with Docker.

### Environment Variables

Required environment variables for production:
- `NODE_ENV=production`
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secure JWT secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `FRONTEND_URL` - Frontend application URL
- `BACKEND_URL` - Backend API URL

## Support

For API support and questions:
- Check the health endpoint: `/api/health`
- Review authentication status: `/api/auth/health`
- Monitor WebSocket connection status
- Check server logs for detailed error information
