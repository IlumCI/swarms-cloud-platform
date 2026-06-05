import { AgentStatus } from './agent';

export type ViewMode = 'grid' | 'table' | 'heatmap' | 'kanban';

export type ThemeColor = 'cyan' | 'purple' | 'red' | 'green';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface FilterOptions {
  status?: AgentStatus[];
  model?: string[];
  search?: string;
  sortBy?: 'name' | 'created_at' | 'last_execution';
  sortOrder?: 'asc' | 'desc';
}

// Button component props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// Input component props
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

// Card component props
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid';
  neonColor?: ThemeColor;
}
