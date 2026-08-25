"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildArbitrationGraph = exports.ArbitrationStateAnnotation = void 0;
const langgraph_1 = require("@langchain/langgraph");
const critics_1 = require("../agents/critics");
const disagreement_1 = require("../agents/disagreement");
const adjudicator_1 = require("../agents/adjudicator");
// Define the State using Annotation for LangGraph
exports.ArbitrationStateAnnotation = langgraph_1.Annotation.Root({
    originalPrompt: (0, langgraph_1.Annotation)(),
    originalOutput: (0, langgraph_1.Annotation)(),
    accuracyCritique: (0, langgraph_1.Annotation)(),
    logicCritique: (0, langgraph_1.Annotation)(),
    completenessCritique: (0, langgraph_1.Annotation)(),
    disagreements: (0, langgraph_1.Annotation)({
        reducer: (curr, next) => next || curr,
        default: () => []
    }),
    finalVerdict: (0, langgraph_1.Annotation)()
});
function buildArbitrationGraph() {
    const workflow = new langgraph_1.StateGraph(exports.ArbitrationStateAnnotation)
        // Add nodes
        .addNode("accuracyCritic", critics_1.runAccuracyCritic)
        .addNode("logicCritic", critics_1.runLogicCritic)
        .addNode("completenessCritic", critics_1.runCompletenessCritic)
        .addNode("disagreementDetector", disagreement_1.detectDisagreements)
        .addNode("adjudicator", adjudicator_1.runAdjudicator)
        // Parallel Dispatch to Critics
        .addEdge(langgraph_1.START, "accuracyCritic")
        .addEdge(langgraph_1.START, "logicCritic")
        .addEdge(langgraph_1.START, "completenessCritic")
        // Fan-in to Disagreement Detector
        .addEdge("accuracyCritic", "disagreementDetector")
        .addEdge("logicCritic", "disagreementDetector")
        .addEdge("completenessCritic", "disagreementDetector")
        // From Disagreement Detector to Adjudicator
        .addEdge("disagreementDetector", "adjudicator")
        // Finish
        .addEdge("adjudicator", langgraph_1.END);
    return workflow.compile();
}
exports.buildArbitrationGraph = buildArbitrationGraph;
