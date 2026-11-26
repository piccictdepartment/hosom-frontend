'use client';
import { createContext, useContext, useReducer } from 'react';
import { initialWorkflowState, workflowReducer, type WorkflowAction, type WorkflowState } from '@/lib/workflows';
const WorkflowContext = createContext<{ state: WorkflowState; dispatch: React.Dispatch<WorkflowAction> } | null>(null);
export function WorkflowProvider({ children }: { children: React.ReactNode }) { const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState); return <WorkflowContext.Provider value={{ state, dispatch }}>{children}</WorkflowContext.Provider>; }
export function useWorkflows() { const context = useContext(WorkflowContext); if (!context) throw new Error('WorkflowProvider is missing'); return context; }
