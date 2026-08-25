"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCompletenessCritic = exports.runLogicCritic = exports.runAccuracyCritic = void 0;
const openai_1 = require("@langchain/openai");
const schema_1 = require("../../models/schema");
// Helper function to create structured critics
const getModel = () => new openai_1.ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.1,
}).withStructuredOutput(schema_1.CritiqueSchema);
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
async function runAccuracyCritic(state) {
    const model = getModel();
    const res = await model.invoke([
        ["system", accuracyPrompt],
        ["user", `Original Prompt: ${state.originalPrompt}\n\nOutput: ${state.originalOutput}`]
    ]);
    return { accuracyCritique: res };
}
exports.runAccuracyCritic = runAccuracyCritic;
async function runLogicCritic(state) {
    const model = getModel();
    const res = await model.invoke([
        ["system", logicPrompt],
        ["user", `Original Prompt: ${state.originalPrompt}\n\nOutput: ${state.originalOutput}`]
    ]);
    return { logicCritique: res };
}
exports.runLogicCritic = runLogicCritic;
async function runCompletenessCritic(state) {
    const model = getModel();
    const res = await model.invoke([
        ["system", completenessPrompt],
        ["user", `Original Prompt: ${state.originalPrompt}\n\nOutput: ${state.originalOutput}`]
    ]);
    return { completenessCritique: res };
}
exports.runCompletenessCritic = runCompletenessCritic;
