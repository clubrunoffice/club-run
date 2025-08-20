# Club Run Backend - Node.js API

Elite nightlife operations platform backend with AI copilot integration - Built with Express.js and Prisma ORM.

## 🚀 Features

- **Express.js** with middleware and route management
- **JWT Authentication** with secure session management
- **AI Copilot Service** with OpenRouter integration
- **Real-time WebSocket** communication via Socket.io
- **PostgreSQL Database** with Prisma ORM
- **RESTful API** with comprehensive endpoints
- **Token-based Gamification** system with missions
- **Venue Management** for Atlanta nightlife operations
- **Expense Tracking** with analytics
- **Multi-agent AI System** with performance monitoring

## 🏗️ Architecture

### Tech Stack
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io
- **Authentication**: JWT with bcryptjs
- **AI Integration**: OpenRouter API
- **Validation**: Joi
- **Monitoring**: Winston logging
- **Testing**: Jest

### Project Structure
```
backend/
├── src/
│   ├── routes/           # Express routes
│   │   ├── auth.js      # Authentication endpoints
│   │   ├── users.js     # User management
│   │   ├── venues.js    # Venue management
│   │   ├── checkins.js  # Check-in system
│   │   ├── missions.js  # Mission system
│   │   ├── expenses.js  # Expense tracking
│   │   ├── chat.js      # AI chat endpoints
│   │   └── agents.js    # AI agents management
│   ├── middleware/      # Express middleware
│   │   └── auth.js      # JWT authentication
│   ├── services/        # Business logic
│   │   ├── copilotService.js    # AI copilot service
│   │   └── monitoringService.js # System monitoring
│   ├── utils/           # Utility functions
│   │   └── auth.js      # Auth utilities
│   ├── websocket/       # Socket.io handlers
│   │   └── handlers.js  # WebSocket event handlers
│   └── server.js        # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js         # Database seeding
├── package.json
└── env.example
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔐 Environment Configuration

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/clubrun"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# AI Services
OPENROUTER_API_KEY="your-openrouter-api-key"
AI_MODEL="meta-llama/llama-3.1-8b-instruct:free"

# App Config
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Optional Services
REDIS_URL="redis://localhost:6379"
LOG_LEVEL="info"
```

## 📊 Database Schema

The application uses Prisma ORM with the following main models:

- **User**: User accounts with token balance and stats
- **Venue**: Nightlife venues with check-in rewards
- **CheckIn**: User check-ins at venues
- **Mission**: Gamification missions with rewards
- **UserMission**: User progress on missions
- **Expense**: User expense tracking
- **ChatMessage**: AI copilot conversation history
- **Agent**: AI agent status and performance
- **SystemLog**: System monitoring and logging

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/activity` - Get user activity feed

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get single venue
- `GET /api/venues/:id/analytics` - Get venue analytics

### Check-ins
- `GET /api/checkins` - Get user check-ins
- `POST /api/checkins` - Create check-in
- `GET /api/checkins/:id` - Get check-in by ID
- `PUT /api/checkins/:id` - Update check-in

### Missions
- `GET /api/missions` - Get user missions
- `POST /api/missions/:id/claim` - Claim mission reward
- `GET /api/missions/available` - Get available missions
- `POST /api/missions/:id/start` - Start mission

### Expenses
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/analytics/summary` - Get expense analytics

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/message` - Send message to copilot
- `DELETE /api/chat/history` - Clear chat history
- `GET /api/chat/stats` - Get chat statistics

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:name` - Get agent by name
- `PUT /api/agents/:name/status` - Update agent status
- `GET /api/agents/:name/metrics` - Get agent metrics
- `GET /api/agents/status/overview` - Get system overview

## 🤖 AI Copilot Features

The AI Copilot service provides:

- **Natural Language Processing**: Understand user intent from text/voice
- **Action Execution**: Perform actions like check-ins, expense logging
- **Mission Management**: Track and update mission progress
- **Context Awareness**: Maintain user context across conversations
- **Real-time Responses**: Instant responses via WebSocket

### Supported Commands
- "Check me into [venue name]"
- "Show my missions"
- "Log $50 expense for drinks"
- "What's my token balance?"
- "Show venue information"

## 🔌 WebSocket Events

### Client to Server
- `join-user` - Join user's personal room
- `chat-message` - Send chat message
- `voice-command` - Send voice command
- `request-update` - Request real-time updates

### Server to Client
- `copilot-response` - AI copilot response
- `voice-response` - Voice command response
- `refresh-data` - Data refresh notification
- `check-in-created` - New check-in notification
- `reward-claimed` - Mission reward claimed
- `system-update` - System-wide updates

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Setup production database**
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

3. **Start production server**
   ```bash
   npm start
   ```

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Database operations
npm run migrate    # Run migrations
npm run seed       # Seed database
npm run build      # Generate Prisma client

# Code quality
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 📈 Monitoring

The application includes comprehensive monitoring:

- **Health Checks**: `/health` endpoint
- **System Logs**: Structured logging with Winston
- **Performance Metrics**: Agent performance tracking
- **Error Tracking**: Centralized error logging
- **Real-time Analytics**: Live system metrics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API rate limiting
- **Input Validation**: Request validation with Joi
- **CORS Protection**: Cross-origin request protection
- **Helmet Security**: Security headers
- **Password Hashing**: bcryptjs for password security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Club Run Backend** - Powering the future of nightlife operations with AI intelligence. 