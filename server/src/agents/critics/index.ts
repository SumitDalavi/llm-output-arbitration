import { ChatOpenAI } from "@langchain/openai";
import { CritiqueSchema, ArbitrationState } from "../../models/schema";

// Helper function to create structured critics
const getModel = () => new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.1,
}).withStructuredOutput(CritiqueSchema);

const accuracyPrompt = `You are the Factual Accuracy Critic.
Check whether claims in the provided output are verifiable and internally consistent.
Return your evaluation in JSON format according to the schema. 
Dimension must be "accuracy".`;

const logicPrompt = `You are the Logical Consistency Critic.
Check whether the reasoning follows and conclusions are supported in the provided output.
Return your evaluation in JSON format according to the schema.
Dimension must be "logic".`;

const completenessPrompt = `You are the Completeness Critic.
Check whether the response addresses all parts of the original question and flags any gaps.
Return your evaluation in JSON format according to the schema.
Dimension must be "completeness".`;

export async function runAccuracyCritic(state: ArbitrationState) {
  const model = getModel();
  const res = await model.invoke([
    ["system", accuracyPrompt],
    ["user", `Original Prompt: ${state.originalPrompt}\n\nOutput: ${state.originalOutput}`]
  ]);
  return { accuracyCritique: res };
}

export async function runLogicCritic(state: ArbitrationState) {
  const model = getModel();
  const res = await model.invoke([
    ["system", logicPrompt],
    ["user", `Original Prompt: ${state.originalPrompt}\n\nOutput: ${state.originalOutput}`]
  ]);
  return { logicCritique: res };
}

export async function runCompletenessCritic(state: ArbitrationState) {
  const model = getModel();
  const res = await model.invoke([
    ["system", completenessPrompt],
    ["user", `Original Prompt: ${state.originalPrompt}\n\nOutput: ${state.originalOutput}`]
  ]);
  return { completenessCritique: res };
}
