import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ArbitrationState } from "../models/schema";
import { runAccuracyCritic, runLogicCritic, runCompletenessCritic } from "../agents/critics";
import { detectDisagreements } from "../agents/disagreement";
import { runAdjudicator } from "../agents/adjudicator";

// Define the State using Annotation for LangGraph
export const ArbitrationStateAnnotation = Annotation.Root({
  originalPrompt: Annotation<string>(),
  originalOutput: Annotation<string>(),
  accuracyCritique: Annotation<any>(),
  logicCritique: Annotation<any>(),
  completenessCritique: Annotation<any>(),
  disagreements: Annotation<string[]>({
    reducer: (curr, next) => next || curr,
    default: () => []
  }),
  finalVerdict: Annotation<any>()
});

export function buildArbitrationGraph() {
  const workflow = new StateGraph(ArbitrationStateAnnotation)
    // Add nodes
    .addNode("accuracyCritic", runAccuracyCritic)
    .addNode("logicCritic", runLogicCritic)
    .addNode("completenessCritic", runCompletenessCritic)
    .addNode("disagreementDetector", detectDisagreements)
    .addNode("adjudicator", runAdjudicator)

    // Parallel Dispatch to Critics
    .addEdge(START, "accuracyCritic")
    .addEdge(START, "logicCritic")
    .addEdge(START, "completenessCritic")

    // Fan-in to Disagreement Detector
    .addEdge("accuracyCritic", "disagreementDetector")
    .addEdge("logicCritic", "disagreementDetector")
    .addEdge("completenessCritic", "disagreementDetector")

    // From Disagreement Detector to Adjudicator
    .addEdge("disagreementDetector", "adjudicator")

    // Finish
    .addEdge("adjudicator", END);

  return workflow.compile();
}
