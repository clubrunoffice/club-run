# 🚦 Enhanced Club Run Agent Flow

This document describes the fully integrated Club Run agent flow with research, reporting, real-time spreadsheets, Supabase backend sync, and weekly downloadable reports.

## 🌟 Overview

The enhanced agent flow provides a complete automation system for Club Run operations:

```
Mission Creation (Client/Admin)
   ↓
Research Agent (Enriches with Venue Details via GPT)
   ↓
Mission Assignment (AI Matching Agent)
   ↓
Runner Execution (Clickable Address, Budget, Service Pack)
   ↓
Reporting Agent (Logs to Live Spreadsheet + Supabase)
   ↓
Copilot/Runner/Client/Admin Dashboards updated in real-time
   ↓
Weekly Report Generator (Creates Downloadable Ledger PDF/CSV for Runners, Clients, Admins; All Backends Synced)
```

## 🏗️ Architecture

### Core Components

1. **Research Agent** (`src/agents/ResearchAgent.js`)
   - Uses GPT to enrich venue addresses with neighborhood details
   - Provides safety info, parking, local restrictions, and tips
   - Caches results for performance

2. **Mission Assignment Agent** (`src/agents/MissionAssignmentAgent.js`)
   - AI-powered runner matching based on location, performance, availability
   - Scoring algorithm considers proximity, experience, and fairness
   - Automatic assignment with reasoning

3. **Reporting Agent** (`src/agents/ReportingAgent.js`)
   - Real-time logging to Google Sheets and Supabase
   - Ensures data consistency between systems
   - Handles all mission events (status changes, check-ins, expenses)

4. **Weekly Report Generator** (`src/reports/WeeklyReportGenerator.js`)
   - Creates downloadable PDF, CSV, and Excel reports
   - Role-based filtering (runner, client, admin views)
   - Automatic upload to Supabase Storage

5. **Orchestration Service** (`src/services/ai/OrchestrationService.js`)
   - Coordinates all agents in the workflow
   - Provides unified API for the complete flow
   - Handles error recovery and system health

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy `env.example` to `.env` and configure:

```bash
# AI Services
OPENAI_API_KEY="your-openai-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"
AI_MODEL="gpt-4o-mini"

# Google Services
GOOGLE_SERVICE_ACCOUNT_KEY_FILE="path/to/service-account-key.json"
REPORTING_SHEET_ID="your-google-sheet-id-for-reporting"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 3. Start the Server

```bash
npm run dev
```

### 4. Run Tests

```bash
node test-enhanced-flow.js
```

## 📡 API Endpoints

### Orchestration Endpoints

#### Health Check
```http
GET /api/orchestration/health
```

#### Create Mission with Enrichment
```http
POST /api/orchestration/missions/create
Content-Type: application/json

{
  "address": "123 Main Street, New York, NY 10001",
  "budget": 500,
  "client_id": "client-123",
  "dj_service_pack": "premium",
  "event_type": "corporate",
  "event_date": "2024-02-15T19:00:00Z",
  "special_requirements": "High-end audio system required"
}
```

#### Update Mission Status
```http
PUT /api/orchestration/missions/:missionId/status
Content-Type: application/json

{
  "status": "in_progress",
  "additionalData": {
    "notes": "Runner has started the mission"
  }
}
```

#### Runner Check-in
```http
POST /api/orchestration/missions/:missionId/checkin
Content-Type: application/json

{
  "runnerId": "runner-456",
  "checkInData": {
    "location": "Venue entrance",
    "coordinates": { "lat": 40.7589, "lng": -73.9851 },
    "notes": "Arrived at venue, setting up equipment"
  }
}
```

#### Log Expense
```http
POST /api/orchestration/expenses
Content-Type: application/json

{
  "description": "Equipment rental - DJ mixer",
  "amount": 150.00,
  "category": "equipment",
  "runner_id": "runner-456",
  "mission_id": "mission-789",
  "receipt_url": "https://example.com/receipt.pdf"
}
```

#### Mission Completion
```http
POST /api/orchestration/missions/:missionId/complete
Content-Type: application/json

{
  "notes": "Mission completed successfully",
  "rating": 5,
  "feedback": "Excellent performance",
  "completion_time": "2024-02-15T22:00:00Z"
}
```

#### Generate Weekly Report
```http
POST /api/orchestration/reports/weekly
Content-Type: application/json

{
  "userId": "user-123",
  "role": "runner",
  "weekStart": "2024-02-12T00:00:00Z"
}
```

#### Get User Reports
```http
GET /api/orchestration/reports/user/:userId
```

#### Verify Data Consistency
```http
GET /api/orchestration/missions/:missionId/consistency
```

### Test Endpoints

#### Test Research Agent
```http
POST /api/orchestration/test/research
Content-Type: application/json

{
  "address": "123 Main Street, New York, NY 10001"
}
```

#### Test Mission Assignment
```http
POST /api/orchestration/test/assignment
Content-Type: application/json

{
  "address": "456 Broadway, New York, NY 10013",
  "budget": 500,
  "client_id": "client-123"
}
```

## 🔧 Configuration

### Google Sheets Setup

1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create a Service Account
4. Download the JSON key file
5. Share your Google Sheet with the service account email
6. Set `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` and `REPORTING_SHEET_ID`

### Supabase Setup

1. Create a Supabase project
2. Set up the required tables (see Database Schema below)
3. Configure storage buckets for reports
4. Set environment variables

### OpenAI/OpenRouter Setup

1. Get API key from OpenAI or OpenRouter
2. Set `OPENAI_API_KEY` or `OPENROUTER_API_KEY`
3. Configure `AI_MODEL` (default: "gpt-4o-mini")

## 📊 Database Schema

### Required Tables

#### missions_log
```sql
CREATE TABLE missions_log (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  mission_id VARCHAR(255),
  runner_id VARCHAR(255),
  client_id VARCHAR(255),
  status VARCHAR(100),
  address TEXT,
  budget DECIMAL(10,2),
  dj_service_pack VARCHAR(100),
  enriched_venue_data BOOLEAN,
  action_type VARCHAR(100),
  action_details TEXT,
  week_number INTEGER,
  year INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### expenses
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  description TEXT,
  amount DECIMAL(10,2),
  category VARCHAR(100),
  runner_id VARCHAR(255),
  mission_id VARCHAR(255),
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### weekly_reports
```sql
CREATE TABLE weekly_reports (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  role VARCHAR(100),
  week_start TIMESTAMP,
  week_end TIMESTAMP,
  csv_url TEXT,
  pdf_url TEXT,
  excel_url TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  mission_count INTEGER,
  expense_count INTEGER,
  total_budget DECIMAL(10,2),
  total_expenses DECIMAL(10,2)
);
```

#### mission_assignments
```sql
CREATE TABLE mission_assignments (
  id SERIAL PRIMARY KEY,
  mission_id VARCHAR(255),
  runner_id VARCHAR(255),
  assigned_at TIMESTAMP DEFAULT NOW(),
  assignment_score INTEGER,
  assignment_reason TEXT
);
```

## 🧪 Testing

### Run Complete Test Suite

```bash
node test-enhanced-flow.js
```

### Individual Component Tests

```bash
# Test Research Agent
curl -X POST http://localhost:3001/api/orchestration/test/research \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main Street, New York, NY 10001"}'

# Test Mission Assignment
curl -X POST http://localhost:3001/api/orchestration/test/assignment \
  -H "Content-Type: application/json" \
  -d '{"address": "456 Broadway, New York, NY 10013", "budget": 500}'
```

## 📈 Monitoring

### System Health

```bash
curl http://localhost:3001/api/orchestration/health
```

### Data Consistency

```bash
curl http://localhost:3001/api/orchestration/missions/:missionId/consistency
```

## 🔄 Workflow Examples

### Complete Mission Lifecycle

1. **Client creates mission**
   ```javascript
   const missionData = {
     address: "789 5th Avenue, New York, NY 10065",
     budget: 750,
     client_id: "client-123",
     dj_service_pack: "standard"
   };
   
   const result = await fetch('/api/orchestration/missions/create', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(missionData)
   });
   ```

2. **System automatically:**
   - Enriches venue with GPT research
   - Assigns best runner
   - Logs to spreadsheet and Supabase

3. **Runner executes mission**
   ```javascript
   // Check-in
   await fetch(`/api/orchestration/missions/${missionId}/checkin`, {
     method: 'POST',
     body: JSON.stringify({
       runnerId: "runner-456",
       checkInData: { location: "Venue entrance" }
     })
   });
   
   // Log expenses
   await fetch('/api/orchestration/expenses', {
     method: 'POST',
     body: JSON.stringify({
       description: "Equipment rental",
       amount: 150.00,
       runner_id: "runner-456"
     })
   });
   
   // Complete mission
   await fetch(`/api/orchestration/missions/${missionId}/complete`, {
     method: 'POST',
     body: JSON.stringify({
       rating: 5,
       notes: "Excellent service"
     })
   });
   ```

4. **Generate weekly report**
   ```javascript
   const report = await fetch('/api/orchestration/reports/weekly', {
     method: 'POST',
     body: JSON.stringify({
       userId: "user-123",
       role: "runner"
     })
   });
   ```

## 🛠️ Troubleshooting

### Common Issues

1. **Research Agent fails**
   - Check OpenAI/OpenRouter API key
   - Verify API quota and billing
   - Check network connectivity

2. **Google Sheets logging fails**
   - Verify service account key file path
   - Check sheet permissions
   - Ensure sheet ID is correct

3. **Supabase connection issues**
   - Verify URL and API keys
   - Check table permissions
   - Ensure RLS policies are configured

4. **Report generation fails**
   - Check Supabase Storage bucket permissions
   - Verify file system write permissions
   - Ensure Puppeteer dependencies are installed

### Debug Mode

Set `LOG_LEVEL=debug` in your environment for detailed logging.

## 📚 Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Puppeteer Documentation](https://pptr.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. 