# Architecture — llm-output-arbitration
> Last updated: 2026-08-29 | Maturity: Partial Prototype
> _LLM consensus and arbitration engine._

## System Diagram
```mermaid
flowchart TD
    Client(["Client App"])
    Arbitrator["Arbitration Engine"]
    LLM1["GPT-4o (Mock)"]
    LLM2["Claude 3.5 (Mock)"]
    LLM3["Gemini 1.5 (Mock)"]
    Evaluator["Cost/Quality Evaluator"]

    Client -->|"Prompt"| Arbitrator
    Arbitrator --> LLM1
    Arbitrator --> LLM2
    Arbitrator --> LLM3
    LLM1 -.->|"Ans 1"| Evaluator
    LLM2 -.->|"Ans 2"| Evaluator
    LLM3 -.->|"Ans 3"| Evaluator
    Evaluator -->|"Best Answer"| Client
```

## Component Table
| Component | File | Responsibility | Tech |
|---|---|---|---|
| Arbitrator | `src/arbitrator/`| Manages parallel LLM calls | Python Asyncio |
| Evaluator | `src/evaluator/`| Scores answers on cost/speed/quality | Python |
| API | `server/`| REST Interface | FastAPI |

## Dependency Honesty Table
| Dependency | Status | Notes |
|---|---|---|
| Providers | **Mocked** | Currently uses static test fixtures for LLM responses to avoid API costs during evaluation. |
