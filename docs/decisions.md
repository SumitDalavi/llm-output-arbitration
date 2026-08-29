# Decisions

## ADR-001: Cost-Adjusted Arbitration Strategy
**Date:** 2026-08-29  
**Status:** Accepted

**Context:**  
Using multiple LLMs for a single prompt increases costs and latency. We need a way to justify this.

**Decision:**  
The arbitrator will score answers not just on semantic similarity or correctness, but also compute the cost of the token usage. If a cheaper model (like GPT-4o-mini) returns an answer semantically identical to a more expensive model (like Claude-3.5-Sonnet), the arbitrator designates the cheaper model as the "winner".

**Consequences:**  
- ✅ System optimizes for cost-efficiency automatically.
- ✅ Creates a feedback loop to downgrade prompt complexity if cheaper models suffice.
