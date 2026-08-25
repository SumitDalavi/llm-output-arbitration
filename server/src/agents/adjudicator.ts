import { ChatOpenAI } from "@langchain/openai";
import { ArbitrationState, VerdictSchema } from "../models/schema";

export async function runAdjudicator(state: ArbitrationState) {
  const model = new ChatOpenAI({
    modelName: "gpt-4o", // Using full GPT-4o for the adjudicator as it needs higher reasoning
    temperature: 0.1,
  }).withStructuredOutput(VerdictSchema);

  const prompt = `You are the Adjudicator Agent.
You receive:
1. The original output being evaluated.
2. The reports from three critics (Accuracy, Logic, Completeness).
3. A list of detected disagreements between critics.

Your job is to weigh the evidence, resolve conflicts, and produce a final verdict.
Reason through each disagreement explicitly (you can add this reasoning in the 'summary' or 'reasoning' fields of dismissed flags).
When critics disagree about a factual claim, attempt to verify it logically.
When they disagree on logic, trace the reasoning chain step by step.
Produce a structured output with: overall quality score (1-10), confidence level, a list of confirmed issues, a list of dismissed flags, and a one-paragraph summary.`;

  const userContent = `
Original Prompt: ${state.originalPrompt}
Original Output: ${state.originalOutput}

--- CRITIQUES ---
Accuracy: ${JSON.stringify(state.accuracyCritique, null, 2)}
Logic: ${JSON.stringify(state.logicCritique, null, 2)}
Completeness: ${JSON.stringify(state.completenessCritique, null, 2)}

--- DETECTED DISAGREEMENTS ---
${JSON.stringify(state.disagreements, null, 2)}
`;

  const res = await model.invoke([
    ["system", prompt],
    ["user", userContent]
  ]);

  return { finalVerdict: res };
}
