# Club Run Backend Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the backend directory:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

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

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed
```

### 3. Start Development Server

```bash
npm run dev
```

## 📊 Database Requirements

- **PostgreSQL 14+** with the following extensions:
  - `uuid-ossp` for UUID generation
  - `pg_trgm` for text search (optional)

## 🔑 Required API Keys

### OpenRouter API
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key
3. Add to `.env` as `OPENROUTER_API_KEY`

## 🧪 Testing the Setup

Run the test script to verify everything is working:

```bash
node test.js
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/           # API endpoints
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   ├── utils/           # Utility functions
│   ├── websocket/       # Socket.io handlers
│   └── server.js        # Main server file
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js         # Initial data
├── package.json
├── env.example
└── README.md
```

## 🔌 API Endpoints

Once running, the API will be available at `http://localhost:3001`:

- **Health Check**: `GET /health`
- **Authentication**: `POST /api/auth/register`, `POST /api/auth/login`
- **Users**: `GET /api/users/profile`, `PUT /api/users/profile`
- **Venues**: `GET /api/venues`, `GET /api/venues/:id`
- **Check-ins**: `POST /api/checkins`, `GET /api/checkins`
- **Missions**: `GET /api/missions`, `POST /api/missions/:id/claim`
- **Expenses**: `GET /api/expenses`, `POST /api/expenses`
- **Chat**: `POST /api/chat/message`, `GET /api/chat/history`
- **Agents**: `GET /api/agents`, `GET /api/agents/:name`

## 🤖 AI Copilot Features

The backend includes a sophisticated AI copilot that can:

- Process natural language commands
- Handle check-ins via voice/text
- Log expenses automatically
- Track mission progress
- Provide venue recommendations
- Answer questions about user data

### Example Commands:
- "Check me into MJQ Concourse"
- "Log $50 expense for drinks"
- "Show my active missions"
- "What's my token balance?"

## 🔌 WebSocket Events

Real-time communication is available via Socket.io:

### Client Events:
- `join-user` - Join user room
- `chat-message` - Send message to copilot
- `voice-command` - Send voice command
- `request-update` - Request data updates

### Server Events:
- `copilot-response` - AI response
- `check-in-created` - New check-in
- `reward-claimed` - Mission reward
- `refresh-data` - Data updates

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Generate Prisma client
npm run migrate         # Run database migrations
npm run seed            # Seed database

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code
```

## 🚀 Production Deployment

1. **Set production environment variables**
2. **Run production migrations**: `npx prisma migrate deploy`
3. **Seed production data**: `npm run seed`
4. **Start production server**: `npm start`

## 🔒 Security Features

- JWT authentication with session management
- Rate limiting on API endpoints
- Input validation with Joi
- CORS protection
- Security headers with Helmet
- Password hashing with bcryptjs

## 📈 Monitoring

- Health check endpoint: `GET /health`
- System logs with Winston
- Performance metrics tracking
- Error logging and monitoring
- Real-time system analytics

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists

2. **Prisma Client Error**
   - Run `npx prisma generate`
   - Check schema.prisma syntax

3. **Missing Dependencies**
   - Run `npm install`
   - Check package.json

4. **Environment Variables**
   - Verify .env file exists
   - Check all required variables are set

### Getting Help:

- Check the logs for error messages
- Verify all environment variables are set
- Ensure database is properly configured
- Test individual components with the test script

---

**Club Run Backend** is now ready to power your nightlife operations platform! 🎉 