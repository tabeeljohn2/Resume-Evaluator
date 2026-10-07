export interface ResumeEvaluation {
  overall_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  suggestions: string[];
  ats_compatibility_notes: string;
}