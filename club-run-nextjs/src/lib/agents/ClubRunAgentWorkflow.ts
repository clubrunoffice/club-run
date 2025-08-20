import { ClubRunAgentState } from "@/types/AgentState";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export class ClubRunAgentWorkflow {
  constructor() {}

  async run(initialState: ClubRunAgentState): Promise<ClubRunAgentState> {
    try {
      // Step 1: Data Collection
      let state = await this.dataCollectorNode(initialState);
      
      // Step 2: Agent Processing
      state = await this.agentProcessorNode(state);
      
      // Step 3: Insight Generation
      state = await this.insightGeneratorNode(state);
      
      // Step 4: Action Execution
      state = await this.actionExecutorNode(state);
      
      // Step 5: Dashboard Update
      state = await this.dashboardUpdaterNode(state);
      
      return state;
    } catch (error) {
      console.error('Workflow execution error:', error);
      return {
        ...initialState,
        errors: [...initialState.errors, error instanceof Error ? error.message : 'Unknown error'],
        currentTask: "error"
      };
    }
  }

  // Node implementations
  async dataCollectorNode(state: ClubRunAgentState): Promise<ClubRunAgentState> {
    // gather data based on role
    const data = await collectDataForRole(state.userId, state.userRole);
    return { ...state, data, confidence: assessDataQuality(data) };
  }

  async agentProcessorNode(state: ClubRunAgentState): Promise<ClubRunAgentState> {
    const { userRole, currentTask, confidence, data } = state;
    
    // Determine which agent to use based on role and task
    let agentType = 'research';
    if (confidence < 0.7) {
      agentType = 'research';
    } else if (userRole === "runner" && currentTask.includes("expense")) {
      agentType = 'budget';
    } else if (userRole === "client" || userRole === "operations") {
      agentType = 'analytics';
    }

    // Process with appropriate agent
    const insights = await this.processWithAgent(agentType, data, userRole);
    
    return { 
      ...state, 
      insights: [...state.insights, ...insights], 
      actionQueue: [...state.actionQueue, `update_${agentType}`] 
    };
  }

  async processWithAgent(agentType: string, data: any, userRole: string) {
    let prompt = '';
    
    switch (agentType) {
      case 'research':
        prompt = buildResearchPrompt(data, userRole);
        break;
      case 'budget':
        prompt = buildBudgetPrompt(data);
        break;
      case 'analytics':
        prompt = buildAnalyticsPrompt(data);
        break;
      default:
        prompt = buildResearchPrompt(data, userRole);
    }

    try {
      const resp = await openai.chat.completions.create({ 
        model: "gpt-4o-mini", 
        messages: [{role:"user",content:prompt}] 
      });
      return parseInsights(resp.choices[0].message.content);
    } catch (error) {
      console.error('Error processing with agent:', error);
      return [];
    }
  }

  async insightGeneratorNode(state: ClubRunAgentState): Promise<ClubRunAgentState> {
    const consolidated = consolidateInsights(state.insights);
    return { 
      ...state, 
      insights: consolidated, 
      actionQueue: [...state.actionQueue, "notify_user"] 
    };
  }

  async actionExecutorNode(state: ClubRunAgentState): Promise<ClubRunAgentState> {
    for (const action of state.actionQueue) {
      await executeAction(action, state.userId, state.insights);
    }
    return { ...state, actionQueue: [] };
  }

  async dashboardUpdaterNode(state: ClubRunAgentState): Promise<ClubRunAgentState> {
    await updateUserDashboard(state.userId, state.insights);
    return { ...state, currentTask: "completed" };
  }
}

// Helper functions (implementations)
async function collectDataForRole(userId: string, role: string) {
  // Mock implementation - in real app, this would fetch from database
  const mockData = {
    runner: {
      venues: ["Club A", "Club B", "Club C"],
      expenses: [100, 200, 150],
      schedule: ["2024-01-15", "2024-01-16", "2024-01-17"]
    },
    client: {
      bookings: ["Event 1", "Event 2"],
      preferences: ["VIP", "Bottle Service"],
      budget: 5000
    },
    operations: {
      staff: ["John", "Jane", "Bob"],
      inventory: ["Bottles", "Glasses", "Ice"],
      metrics: { revenue: 15000, attendance: 500 }
    }
  };
  
  return mockData[role as keyof typeof mockData] || {};
}

function assessDataQuality(data: any): number {
  // Simple quality assessment based on data completeness
  if (!data || Object.keys(data).length === 0) return 0.3;
  if (Object.keys(data).length > 5) return 0.9;
  return 0.7;
}

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

function buildBudgetPrompt(data: any): string {
  return `As a Club Run budget analyst, analyze the following expense data:
  
Data: ${JSON.stringify(data, null, 2)}

Please provide:
1. Budget optimization recommendations
2. Cost-saving opportunities
3. Expense tracking insights
4. Financial forecasting

Format your response as actionable insights.`;
}

function buildAnalyticsPrompt(data: any): string {
  return `As a Club Run analytics specialist, analyze the following operational data:
  
Data: ${JSON.stringify(data, null, 2)}

Please provide:
1. Performance metrics analysis
2. Operational efficiency insights
3. Revenue optimization strategies
4. Customer behavior patterns

Format your response as actionable insights.`;
}

function parseInsights(content: string | null): any[] {
  if (!content) return [];
  
  // Simple parsing - in production, use more sophisticated parsing
  const insights = content.split('\n').filter(line => line.trim().length > 0);
  return insights.map(insight => ({
    id: Date.now() + Math.random(),
    content: insight,
    timestamp: new Date().toISOString(),
    type: 'insight'
  }));
}

function consolidateInsights(insights: any[]): any[] {
  // Remove duplicates and organize insights
  const uniqueInsights = insights.filter((insight, index, self) => 
    index === self.findIndex(i => i.content === insight.content)
  );
  
  return uniqueInsights.map(insight => ({
    ...insight,
    priority: insight.content.includes('urgent') ? 'high' : 'medium'
  }));
}

async function executeAction(action: string, userId: string, insights: any[]) {
  // Mock action execution - in production, this would trigger real actions
  console.log(`Executing action: ${action} for user: ${userId}`);
  
  switch (action) {
    case 'update_venues':
      // Update venue database
      break;
    case 'update_budget':
      // Update budget tracking
      break;
    case 'update_analytics':
      // Update analytics dashboard
      break;
    case 'notify_user':
      // Send notification to user
      break;
  }
}

async function updateUserDashboard(userId: string, insights: any[]) {
  // Mock dashboard update - in production, this would update the UI
  console.log(`Updating dashboard for user: ${userId} with ${insights.length} insights`);
} 