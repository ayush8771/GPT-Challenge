import type { DocumentAnalysis, RedFlag } from '../types';
import { truncateText } from './pdfExtractor';

/**
 * Generates a plain language summary of a legal document
 */
export async function generateSummary(
  documentText: string,
  generateText: (prompt: string, options?: any) => Promise<string>
): Promise<string> {
  const truncated = truncateText(documentText, 6000);
  
  const prompt = `Summarize the following legal document in simple, easy-to-understand English that a non-lawyer can understand. Focus on the key points, obligations, and rights:

${truncated}

Provide a clear, concise summary:`;

  const summary = await generateText(prompt, {
    systemPrompt: 'You are a helpful legal assistant that explains complex legal documents in simple terms.',
    maxTokens: 400,
    temperature: 0.3,
  });

  return summary;
}

/**
 * Detects red flags in a legal document
 */
export async function detectRedFlags(
  documentText: string,
  generateText: (prompt: string, options?: any) => Promise<string>
): Promise<RedFlag[]> {
  const truncated = truncateText(documentText, 6000);
  
  const prompt = `Analyze the following legal document and identify any risky, unfair, or unusual clauses. For each issue found, provide:
1. The problematic clause or text
2. Risk level (HIGH, MEDIUM, or LOW)
3. Brief explanation of why it's concerning
4. Category (e.g., Termination, Payment, Liability, Privacy, etc.)

Document:
${truncated}

List all red flags in this exact format:
[RISK:HIGH] Category: Payment | Clause: "..." | Explanation: "..."
[RISK:MEDIUM] Category: Termination | Clause: "..." | Explanation: "..."

Red flags:`;

  const response = await generateText(prompt, {
    systemPrompt: 'You are a legal expert who identifies risks and unfair terms in contracts and legal documents.',
    maxTokens: 600,
    temperature: 0.4,
  });

  // Parse the response to extract red flags
  return parseRedFlags(response);
}

/**
 * Calculates a risk score for the document
 */
export function calculateRiskScore(redFlags: RedFlag[]): {
  riskScore: number;
  safeCount: number;
  riskyCount: number;
} {
  const highRiskCount = redFlags.filter(f => f.severity === 'high').length;
  const mediumRiskCount = redFlags.filter(f => f.severity === 'medium').length;
  const lowRiskCount = redFlags.filter(f => f.severity === 'low').length;

  // Calculate weighted risk score (1-10 scale)
  const totalWeight = (highRiskCount * 3) + (mediumRiskCount * 2) + (lowRiskCount * 1);
  const maxPossibleWeight = 30; // Assume max 10 high-risk issues as ceiling
  const riskScore = Math.min(10, Math.max(1, Math.round((totalWeight / maxPossibleWeight) * 10)));

  const riskyCount = highRiskCount + mediumRiskCount;
  const safeCount = Math.max(0, 10 - riskyCount); // Estimate safe sections

  return { riskScore, safeCount, riskyCount };
}

/**
 * Performs full document analysis
 */
export async function analyzeDocument(
  documentText: string,
  generateText: (prompt: string, options?: any) => Promise<string>,
  onProgress?: (stage: string) => void
): Promise<DocumentAnalysis> {
  onProgress?.('Generating summary...');
  const summary = await generateSummary(documentText, generateText);

  onProgress?.('Detecting red flags...');
  const redFlags = await detectRedFlags(documentText, generateText);

  onProgress?.('Calculating risk score...');
  const { riskScore, safeCount, riskyCount } = calculateRiskScore(redFlags);

  return {
    summary,
    redFlags,
    riskScore,
    safeCount,
    riskyCount,
  };
}

/**
 * Parses red flags from the LLM response
 */
function parseRedFlags(response: string): RedFlag[] {
  const redFlags: RedFlag[] = [];
  const lines = response.split('\n');

  for (const line of lines) {
    const match = line.match(/\[RISK:(HIGH|MEDIUM|LOW)\]\s*Category:\s*([^|]+)\s*\|\s*Clause:\s*"([^"]+)"\s*\|\s*Explanation:\s*"?([^"]+)"?/i);
    
    if (match) {
      const [, severity, category, clause, explanation] = match;
      redFlags.push({
        id: `flag-${Date.now()}-${Math.random()}`,
        text: clause.trim(),
        severity: severity.toLowerCase() as 'high' | 'medium' | 'low',
        explanation: explanation.trim(),
        category: category.trim(),
      });
    }
  }

  // If parsing fails, create some fallback flags based on keywords
  if (redFlags.length === 0) {
    const lowercaseResponse = response.toLowerCase();
    
    if (lowercaseResponse.includes('termination') || lowercaseResponse.includes('cancel')) {
      redFlags.push({
        id: `flag-${Date.now()}-1`,
        text: 'Termination clause detected',
        severity: 'medium',
        explanation: 'Review termination conditions carefully',
        category: 'Termination',
      });
    }

    if (lowercaseResponse.includes('liability') || lowercaseResponse.includes('damages')) {
      redFlags.push({
        id: `flag-${Date.now()}-2`,
        text: 'Liability limitations detected',
        severity: 'medium',
        explanation: 'Check liability and damages provisions',
        category: 'Liability',
      });
    }
  }

  return redFlags;
}

/**
 * Answers a specific question about the document
 */
export async function answerQuestion(
  question: string,
  documentText: string,
  generateText: (prompt: string, options?: any) => Promise<string>
): Promise<string> {
  const truncated = truncateText(documentText, 6000);
  
  const prompt = `Based on the following legal document, answer this question: "${question}"

Document:
${truncated}

Provide a clear, accurate answer based only on the document content:`;

  const answer = await generateText(prompt, {
    systemPrompt: 'You are a helpful legal assistant. Answer questions about legal documents accurately and concisely. If the document does not contain enough information to answer, say so.',
    maxTokens: 300,
    temperature: 0.3,
  });

  return answer;
}
