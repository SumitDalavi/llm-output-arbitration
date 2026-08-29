# Runbook — llm-output-arbitration
> Last updated: 2026-08-29

## Quick Start
```bash
docker-compose up -d --build
```
API runs on `http://localhost:8000`.

## Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| MOCK_LLMS | `true` | Set to false to use real API keys (if implemented) |

## Run Tests
```bash
pytest tests/
bash tests/e2e/test_costed_comparison.sh
```
