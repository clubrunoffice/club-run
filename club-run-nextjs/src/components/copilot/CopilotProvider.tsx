'use client';

import React, { createContext, useContext, useState, useCallback } from "react";
import { ClubRunAgentWorkflow } from "@/lib/agents/ClubRunAgentWorkflow";
import { ClubRunAgentState } from "@/types/AgentState";

interface CopilotContextType {
  sendMessage: (message: string) => Promise<any[]>;
  isLoading: boolean;
  insights: any[];
  errors: string[];
}

const CopilotContext = createContext<CopilotContextType | null>(null);

interface CopilotProviderProps {
  children: React.ReactNode;
  userId: string;
  userRole: 'runner' | 'client' | 'operations';
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ 
  children, 
  userId, 
  userRole 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  
  const workflow = new ClubRunAgentWorkflow();

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setErrors([]);
    
    try {
      const initialState: ClubRunAgentState = {
        userId,
        userRole,
        currentTask: message,
        data: null,
        insights: [],
        actionQueue: [],
        errors: [],
        confidence: 0
      };
      
      const result = await workflow.run(initialState);
      
      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
      }
      
      if (result.insights && result.insights.length > 0) {
        setInsights(prev => [...prev, ...result.insights]);
        return result.insights;
      }
      
      return [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrors(prev => [...prev, errorMessage]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole, workflow]);

  const contextValue: CopilotContextType = {
    sendMessage,
    isLoading,
    insights,
    errors
  };

  return (
    <CopilotContext.Provider value={contextValue}>
      {children}
    </CopilotContext.Provider>
  );
};

export const useCopilot = (): CopilotContextType => {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
}; 