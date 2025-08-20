# Club Run LangGraph Multi-Agent Workflow Implementation

## Overview

This implementation provides a complete LangGraph-based multi-agent workflow system for Club Run's nightlife operations platform. The system integrates data collection, AI analysis, insight generation, action execution, and dashboard updates with dynamic branching and state management.

## Architecture

### Core Components

1. **Agent State Management** (`src/types/AgentState.ts`)
   - Defines the state interface for the workflow
   - Tracks user context, data, insights, and actions

2. **Workflow Engine** (`src/lib/agents/ClubRunAgentWorkflow.ts`)
   - Implements the multi-agent workflow logic
   - Handles data collection, agent processing, and action execution

3. **React Integration** (`src/components/copilot/`)
   - `CopilotProvider.tsx`: Context provider for workflow integration
   - `ChatWidget.tsx`: UI component for user interaction

4. **Demo Interface** (`src/app/langgraph-demo/page.tsx`)
   - Interactive demonstration of the multi-agent system
   - Role-based testing interface

## Multi-Agent Workflow

### Workflow Steps

1. **Data Collection**
   - Gathers role-specific data based on user context
   - Assesses data quality and confidence levels

2. **Agent Processing**
   - Routes to appropriate agent based on role and task
   - **Research Agent**: Venue research and market analysis
   - **Budget Agent**: Financial analysis and expense tracking
   - **Analytics Agent**: Operational insights and performance metrics

3. **Insight Generation**
   - Consolidates insights from multiple agents
   - Removes duplicates and prioritizes recommendations

4. **Action Execution**
   - Executes actions based on generated insights
   - Updates databases, sends notifications, etc.

5. **Dashboard Update**
   - Updates user interface with new insights
   - Provides real-time feedback

### Agent Types

#### Research Agent
- **Purpose**: Venue research and market analysis
- **Capabilities**:
  - Venue recommendations
  - Market analysis
  - Competitive insights
  - Growth opportunities
- **Triggers**: Low confidence data, venue-related queries

#### Budget Agent
- **Purpose**: Financial analysis and expense management
- **Capabilities**:
  - Budget optimization
  - Cost-saving opportunities
  - Expense tracking insights
  - Financial forecasting
- **Triggers**: Expense-related queries from runners

#### Analytics Agent
- **Purpose**: Operational insights and performance analysis
- **Capabilities**:
  - Performance metrics analysis
  - Operational efficiency insights
  - Revenue optimization strategies
  - Customer behavior patterns
- **Triggers**: Client and operations queries

## Installation

### Prerequisites
- Node.js 18+ 
- Next.js 14+
- OpenAI API key

### Setup

1. **Install Dependencies**
```bash
cd club-run-nextjs
npm install @langchain/langgraph @langchain/core @langchain/openai openai --legacy-peer-deps
```

2. **Environment Configuration**
```bash
# Add to .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Run the Development Server**
```bash
npm run dev
```

4. **Access the Demo**
Navigate to `http://localhost:3000/langgraph-demo`

## Usage

### Basic Integration

```typescript
import { CopilotProvider } from '@/components/copilot/CopilotProvider';
import { ChatWidget } from '@/components/copilot/ChatWidget';

function App() {
  return (
    <CopilotProvider userId="user-123" userRole="runner">
      <div>
        {/* Your app content */}
        <ChatWidget />
      </div>
    </CopilotProvider>
  );
}
```

### Using the Copilot Hook

```typescript
import { useCopilot } from '@/components/copilot/CopilotProvider';

function MyComponent() {
  const { sendMessage, isLoading, insights, errors } = useCopilot();

  const handleQuery = async () => {
    const results = await sendMessage("Find me the best venues in downtown");
    console.log('Generated insights:', results);
  };

  return (
    <div>
      <button onClick={handleQuery} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Ask AI'}
      </button>
      {errors.length > 0 && (
        <div>Errors: {errors.join(', ')}</div>
      )}
    </div>
  );
}
```

### Direct Workflow Usage

```typescript
import { ClubRunAgentWorkflow } from '@/lib/agents/ClubRunAgentWorkflow';

const workflow = new ClubRunAgentWorkflow();

const initialState = {
  userId: 'user-123',
  userRole: 'runner',
  currentTask: 'Find venues in downtown',
  data: null,
  insights: [],
  actionQueue: [],
  errors: [],
  confidence: 0
};

const result = await workflow.run(initialState);
console.log('Workflow result:', result);
```

## Configuration

### Agent Prompts

Customize agent behavior by modifying prompt functions in `ClubRunAgentWorkflow.ts`:

```typescript
function buildResearchPrompt(data: any, role: string): string {
  return `As a Club Run ${role}, analyze the following data and provide insights for venue research:
  
Data: ${JSON.stringify(data, null, 2)}

Please provide:
1. Venue recommendations
2. Market analysis
3. Competitive insights
4. Growth opportunities

Format your response as actionable insights.`;
}
```

### Data Collection

Extend the `collectDataForRole` function to integrate with your database:

```typescript
async function collectDataForRole(userId: string, role: string) {
  // Replace mock data with real database queries
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: { venues: true, expenses: true }
  });
  
  return transformUserData(userData, role);
}
```

### Action Execution

Implement real actions in the `executeAction` function:

```typescript
async function executeAction(action: string, userId: string, insights: any[]) {
  switch (action) {
    case 'update_venues':
      await prisma.venue.updateMany({
        where: { userId },
        data: { insights: insights }
      });
      break;
    case 'notify_user':
      await sendNotification(userId, insights);
      break;
  }
}
```

## Testing

### Demo Interface

The demo page at `/langgraph-demo` provides:
- Role selection (Runner, Client, Operations)
- Interactive chat interface
- Real-time workflow visualization
- Example queries for each role

### Sample Queries

**For Runners:**
- "Find me the best venues in downtown"
- "Analyze my expense report"
- "What are the trending nightlife spots?"

**For Clients:**
- "Show me booking analytics"
- "What are my spending patterns?"
- "Recommend VIP services"

**For Operations:**
- "Analyze staff performance"
- "What are our revenue trends?"
- "Optimize inventory management"

## Error Handling

The system includes comprehensive error handling:

- **Workflow Errors**: Caught and logged with user-friendly messages
- **API Errors**: Graceful degradation with fallback responses
- **State Validation**: Type-safe state management with error boundaries
- **Network Issues**: Retry logic and offline support

## Performance Considerations

### Optimization Strategies

1. **Caching**: Implement Redis caching for frequently accessed data
2. **Streaming**: Use streaming responses for long-running workflows
3. **Batching**: Batch similar queries to reduce API calls
4. **Debouncing**: Debounce user input to prevent excessive API calls

### Monitoring

```typescript
// Add monitoring to workflow execution
async run(initialState: ClubRunAgentState) {
  const startTime = Date.now();
  try {
    const result = await this.executeWorkflow(initialState);
    console.log(`Workflow completed in ${Date.now() - startTime}ms`);
    return result;
  } catch (error) {
    console.error(`Workflow failed after ${Date.now() - startTime}ms:`, error);
    throw error;
  }
}
```

## Security

### Best Practices

1. **API Key Management**: Store OpenAI API keys securely
2. **Input Validation**: Validate all user inputs
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Data Privacy**: Ensure user data is handled according to privacy policies

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional
OPENAI_MODEL=gpt-4o-mini
WORKFLOW_TIMEOUT=30000
MAX_RETRIES=3
```

## Future Enhancements

### Planned Features

1. **Advanced Routing**: Implement more sophisticated agent routing logic
2. **Memory Management**: Add conversation memory and context persistence
3. **Custom Agents**: Allow users to create custom agents for specific tasks
4. **Integration APIs**: Connect with external services (CRM, analytics, etc.)
5. **Real-time Collaboration**: Multi-user workflow collaboration

### Scalability Improvements

1. **Microservices**: Split workflow into microservices
2. **Queue System**: Implement message queues for async processing
3. **Load Balancing**: Distribute workflow execution across multiple instances
4. **Database Optimization**: Implement proper indexing and query optimization

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure OPENAI_API_KEY is set correctly
2. **TypeScript Errors**: Check for proper type definitions
3. **Network Issues**: Verify internet connectivity and API endpoints
4. **Memory Issues**: Monitor memory usage for large workflows

### Debug Mode

Enable debug logging:

```typescript
const workflow = new ClubRunAgentWorkflow();
workflow.debug = true; // Enable detailed logging
```

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Implement changes with proper testing
4. Submit a pull request

### Code Standards

- Use TypeScript for type safety
- Follow ESLint configuration
- Write comprehensive tests
- Document new features

## License

This implementation is part of the Club Run project and follows the same licensing terms.

---

For more information, contact the Club Run development team or refer to the main project documentation. 