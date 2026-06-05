import { useState } from 'react';
import { useAgentStore } from '@/lib/store/agent-store';
import { useUIStore } from '@/lib/store/ui-store';
import { AgentConfig } from '@/types/agent';

export function useAgentExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingAgentIds, setExecutingAgentIds] = useState<Set<string>>(new Set());
  const setAgentStatus = useAgentStore((state) => state.setAgentStatus);
  const addExecutionToHistory = useAgentStore((state) => state.addExecutionToHistory);
  const addToast = useUIStore((state) => state.addToast);
  const swarmsApiKey = useUIStore((state) => state.swarmsApiKey);

  const executeAgent = async (
    agentId: string,
    config: AgentConfig,
    task: string,
    options?: {
      history?: any;
      img?: string;
      imgs?: string[];
      stream?: boolean;
      search_enabled?: boolean;
    }
  ) => {
    if (!swarmsApiKey) {
      const message = 'Please enter your swarms_api_key to execute agents.';
      addToast({
        type: 'error',
        message,
        duration: 5000,
      });
      throw new Error(message);
    }

    setIsExecuting(true);
    setExecutingAgentIds((prev) => new Set([...prev, agentId]));
    setAgentStatus(agentId, 'running');
    // Update kanban status to in_progress when execution starts
    const updateAgent = useAgentStore.getState().updateAgent;
    updateAgent(agentId, { kanbanStatus: 'in_progress' });

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': swarmsApiKey,
        },
        body: JSON.stringify({
          agent_config: config,
          task: task,
          ...options,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = `API Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch (error) {
        throw new Error('Failed to parse API response');
      }

      addExecutionToHistory(agentId, result);
      setAgentStatus(agentId, 'completed');
      // Update kanban status to done when execution completes
      const agent = useAgentStore.getState().getAgentById(agentId);
      if (agent) {
        useAgentStore.getState().updateAgent(agentId, { kanbanStatus: 'done' });
      }

      addToast({
        type: 'success',
        message: `Agent "${config.agent_name || 'Unknown'}" completed successfully`,
        duration: 4000,
      });

      return result;
    } catch (error) {
      setAgentStatus(agentId, 'error');
      addToast({
        type: 'error',
        message: `Agent execution failed: ${(error as Error).message}`,
        duration: 5000,
      });
      throw error;
    } finally {
      setIsExecuting(false);
      setExecutingAgentIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  const isAgentExecuting = (agentId: string) => {
    return executingAgentIds.has(agentId);
  };

  return {
    executeAgent,
    isExecuting,
    isAgentExecuting,
  };
}
