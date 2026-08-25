"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDisagreements = void 0;
const openai_1 = require("@langchain/openai");
const zod_1 = require("zod");
const DisagreementSchema = zod_1.z.object({
    disagreements: zod_1.z.array(zod_1.z.string())
});
async function detectDisagreements(state) {
    const model = new openai_1.ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.1,
    }).withStructuredOutput(DisagreementSchema);
    const prompt = `You are the Disagreement Detector.
You will be provided with three critiques (Accuracy, Logic, Completeness) of the same output.
Compare them and flag cases where:
- Critics disagree on whether something is an issue.
- Severity ratings for a similar issue differ by more than 2 points.
- One critic found issues the others missed entirely (if their domains overlap).

Return a JSON object with a 'disagreements' array of strings explaining the conflicts.`;
    const userContent = `
Accuracy Critique: ${JSON.stringify(state.accuracyCritique, null, 2)}
Logic Critique: ${JSON.stringify(state.logicCritique, null, 2)}
Completeness Critique: ${JSON.stringify(state.completenessCritique, null, 2)}
`;
    const res = await model.invoke([
        ["system", prompt],
        ["user", userContent]
    ]);
    return { disagreements: res.disagreements };
}
exports.detectDisagreements = detectDisagreements;
