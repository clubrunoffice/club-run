export interface ClubRunAgentState {
  userId: string;
  userRole: 'runner' | 'client' | 'operations';
  currentTask: string;
  data: any;
  insights: any[];
  actionQueue: string[];
  errors: string[];
  confidence: number;
} 