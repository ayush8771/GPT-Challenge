export type RiskLevel = 'high' | 'medium' | 'low';

export interface RedFlag {
  id: string;
  text: string;
  severity: RiskLevel;
  explanation: string;
  category: string;
}

export interface DocumentAnalysis {
  summary: string;
  redFlags: RedFlag[];
  riskScore: number;
  safeCount: number;
  riskyCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ModelState {
  isLoaded: boolean;
  isLoading: boolean;
  downloadProgress: number;
  error: string | null;
}
