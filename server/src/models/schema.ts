import { z } from 'zod';

export const IssueSchema = z.object({
  quote: z.string(),
  description: z.string(),
  severity: z.number().min(1).max(5)
});

export const CritiqueSchema = z.object({
  dimension: z.enum(["accuracy", "logic", "completeness"]),
  score: z.number().min(1).max(5),
  issues: z.array(IssueSchema),
  confidence: z.number().min(0).max(1)
});

export const VerdictSchema = z.object({
  overallScore: z.number().min(1).max(10),
  confidenceLevel: z.number().min(0).max(1),
  confirmedIssues: z.array(IssueSchema),
  dismissedFlags: z.array(z.object({
    quote: z.string(),
    description: z.string(),
    reasoning: z.string()
  })),
  summary: z.string()
});

export type Issue = z.infer<typeof IssueSchema>;
export type Critique = z.infer<typeof CritiqueSchema>;
export type Verdict = z.infer<typeof VerdictSchema>;

export interface ArbitrationState {
  originalPrompt: string;
  originalOutput: string;
  accuracyCritique: Critique | null;
  logicCritique: Critique | null;
  completenessCritique: Critique | null;
  disagreements: string[];
  finalVerdict: Verdict | null;
}
