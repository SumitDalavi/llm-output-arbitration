# Architecture: LLM Output Arbitration System

## System Diagram
The following Mermaid.js sequence diagram maps the core workflow and interactions:

```mermaid
sequenceDiagram
Input->>LangGraph: Raw Output
LangGraph->>FactualCritic: GPT-4o
LangGraph->>LogicCritic: Claude
LangGraph->>CompletenessCritic: Llama
LangGraph->>Adjudicator: Resolve disagreements
Adjudicator-->>User: Final Verdict
```

## Component Breakdown
- **Core Technology**: Python, LangGraph, Pydantic
- **Design Paradigm**: Emphasizes high availability, fault tolerance, and security.
