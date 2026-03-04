import { useCallback } from 'react';
import type { DocumentAnalysis, RedFlag } from '../types';

/**
 * Mock text generation for testing without real AI
 */
export function useMockTextGeneration() {
  const generateText = useCallback(async (
    prompt: string,
    options?: {
      systemPrompt?: string;
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check what type of generation is being requested
    if (prompt.includes('Summarize') || prompt.includes('summary')) {
      return generateMockSummary();
    } else if (prompt.includes('red flags') || prompt.includes('risky')) {
      return generateMockRedFlags();
    } else if (prompt.includes('question') || prompt.includes('answer')) {
      return generateMockAnswer(prompt);
    }

    return "This is a mock AI response. The document has been analyzed successfully.";
  }, []);

  return { generateText };
}

function generateMockSummary(): string {
  return `This employment agreement establishes an at-will employment relationship between the employer and employee. 

Key terms include: The employee will work as a Software Engineer with a base salary of $85,000 per year, plus discretionary performance bonuses. The agreement includes standard benefits like health insurance, dental coverage, and retirement plans.

Important restrictions: The employee must maintain strict confidentiality of company information indefinitely. There are non-compete and non-solicitation clauses that extend for several years after employment ends. All work created during employment belongs to the company.

Termination can occur at any time by either party without notice or cause. Upon termination, the employee receives only accrued wages with no severance pay. Any disputes must be resolved through binding arbitration, with the employee potentially bearing all costs.`;
}

function generateMockRedFlags(): string {
  return `[RISK:HIGH] Category: Termination | Clause: "Either party may terminate this Agreement at any time, with or without cause, and with or without notice" | Explanation: "Allows immediate termination without any notice period or severance, providing no job security"

[RISK:HIGH] Category: Non-Compete | Clause: "Employee agrees not to work for any competing company within a 500-mile radius for three years" | Explanation: "Excessively broad geographic scope and unreasonably long duration that may be unenforceable and severely limits future employment"

[RISK:HIGH] Category: Arbitration | Clause: "Employee shall bear all costs of arbitration, including Employer's attorney fees, if Employer prevails" | Explanation: "Places unfair financial burden on employee and discourages dispute resolution"

[RISK:HIGH] Category: Unilateral Changes | Clause: "Employer reserves the right to modify the terms of this Agreement at any time, with or without notice" | Explanation: "Allows employer to change terms without employee consent or notification"

[RISK:MEDIUM] Category: Intellectual Property | Clause: "All inventions created by Employee during employment, whether during work hours or not, shall be the exclusive property of Employer" | Explanation: "Overly broad IP assignment including personal projects done outside work hours"

[RISK:MEDIUM] Category: Confidentiality | Clause: "This confidentiality obligation survives termination of employment and continues indefinitely" | Explanation: "Perpetual confidentiality obligations with no time limit may be unreasonable"

[RISK:MEDIUM] Category: Non-Solicitation | Clause: "Employee agrees not to solicit or recruit any employees of Employer for a period of five years" | Explanation: "Five year non-solicitation period is excessively long and likely unenforceable"

[RISK:LOW] Category: Payment | Clause: "Employee will be eligible for annual performance bonuses at the sole discretion of Employer" | Explanation: "Bonuses are discretionary with no guaranteed amount or criteria"`;
}

function generateMockAnswer(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('terminate') || lowerQuestion.includes('termination')) {
    return "Yes, according to the agreement, the employer can terminate your employment at any time, with or without cause, and with or without notice. This is an at-will employment arrangement that provides minimal job security. Additionally, you would not be entitled to any severance pay beyond accrued but unpaid wages through your termination date.";
  }
  
  if (lowerQuestion.includes('payment') || lowerQuestion.includes('salary') || lowerQuestion.includes('compensation')) {
    return "Your payment obligations are actually about what you'll receive, not what you owe. The agreement specifies a base salary of $85,000 per year, paid according to the employer's standard payroll practices. You're also eligible for annual performance bonuses, though these are at the sole discretion of the employer with no guaranteed amounts.";
  }
  
  if (lowerQuestion.includes('breach') || lowerQuestion.includes('violation')) {
    return "If you breach this agreement, you could face several consequences: You may be immediately terminated for cause. The indemnification clause requires you to compensate the employer for any damages or losses resulting from your breach. You could also be subject to binding arbitration, where you might have to pay all arbitration costs including the employer's attorney fees if they prevail.";
  }
  
  if (lowerQuestion.includes('renewal') || lowerQuestion.includes('automatic')) {
    return "The document does not contain explicit automatic renewal clauses. However, it does state that the employer can modify the agreement terms at any time with or without notice, and continued employment constitutes acceptance of those changes. This effectively allows ongoing modifications without formal renewal processes.";
  }
  
  return "Based on the document, this appears to be a standard at-will employment agreement with several concerning clauses. The specific answer to your question would depend on reviewing the relevant sections in detail. I recommend consulting with an employment attorney for personalized legal advice.";
}

/**
 * Mock document analyzer
 */
export async function analyzeMockDocument(
  documentText: string,
  onProgress?: (stage: string) => void
): Promise<DocumentAnalysis> {
  // Simulate analysis stages
  onProgress?.('Analyzing document structure...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  onProgress?.('Generating plain language summary...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  onProgress?.('Detecting potential red flags...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  onProgress?.('Calculating risk score...');
  await new Promise(resolve => setTimeout(resolve, 1000));

  const redFlags: RedFlag[] = [
    {
      id: 'flag-1',
      text: 'Either party may terminate this Agreement at any time, with or without cause, and with or without notice',
      severity: 'high',
      explanation: 'Allows immediate termination without any notice period or severance, providing no job security',
      category: 'Termination'
    },
    {
      id: 'flag-2',
      text: 'Employee agrees not to work for any competing company within a 500-mile radius for three years',
      severity: 'high',
      explanation: 'Excessively broad geographic scope and unreasonably long duration that may be unenforceable',
      category: 'Non-Compete'
    },
    {
      id: 'flag-3',
      text: 'Employee shall bear all costs of arbitration, including Employer\'s attorney fees, if Employer prevails',
      severity: 'high',
      explanation: 'Places unfair financial burden on employee and discourages dispute resolution',
      category: 'Arbitration'
    },
    {
      id: 'flag-4',
      text: 'Employer reserves the right to modify the terms at any time, with or without notice',
      severity: 'high',
      explanation: 'Allows employer to change terms without employee consent or notification',
      category: 'Contract Terms'
    },
    {
      id: 'flag-5',
      text: 'All inventions created during employment, whether during work hours or not, shall be company property',
      severity: 'medium',
      explanation: 'Overly broad IP assignment including personal projects done outside work hours',
      category: 'Intellectual Property'
    },
    {
      id: 'flag-6',
      text: 'Confidentiality obligation continues indefinitely after termination',
      severity: 'medium',
      explanation: 'Perpetual confidentiality obligations with no time limit may be unreasonable',
      category: 'Confidentiality'
    },
    {
      id: 'flag-7',
      text: 'Employee agrees not to solicit any employees for a period of five years',
      severity: 'medium',
      explanation: 'Five year non-solicitation period is excessively long and likely unenforceable',
      category: 'Non-Solicitation'
    },
    {
      id: 'flag-8',
      text: 'No severance pay upon termination',
      severity: 'medium',
      explanation: 'Employee receives only accrued wages with no severance regardless of circumstances',
      category: 'Compensation'
    }
  ];

  const highRiskCount = redFlags.filter(f => f.severity === 'high').length;
  const mediumRiskCount = redFlags.filter(f => f.severity === 'medium').length;
  
  // Calculate risk score (1-10)
  const totalWeight = (highRiskCount * 3) + (mediumRiskCount * 2);
  const riskScore = Math.min(10, Math.max(1, Math.round((totalWeight / 30) * 10)));
  
  const riskyCount = highRiskCount + mediumRiskCount;
  const safeCount = Math.max(0, 10 - riskyCount);

  return {
    summary: `This employment agreement establishes an at-will employment relationship with a base salary of $85,000 per year plus discretionary bonuses. Key provisions include standard benefits (health insurance, dental, retirement) but also several concerning restrictions.

The agreement contains multiple high-risk clauses: immediate termination without notice or severance, an extremely broad 3-year non-compete within 500 miles, perpetual confidentiality obligations, and a clause allowing the employer to modify terms at any time without notice. 

Additional concerns include extensive intellectual property assignment (even for personal projects), mandatory arbitration where you may pay all costs, and a 5-year non-solicitation period. Many of these terms may be unenforceable but would require legal challenge.

I strongly recommend having an employment attorney review this agreement before signing, particularly the non-compete, arbitration, and unilateral modification clauses.`,
    redFlags,
    riskScore,
    safeCount,
    riskyCount
  };
}
