# llm-output-arbitration

[![Release](https://img.shields.io/github/v/release/SumitDalavi/llm-output-arbitration?color=blue&logo=github)](https://github.com/SumitDalavi/llm-output-arbitration/releases)
[![SBOM](https://img.shields.io/badge/SBOM-SPDX%20JSON-blueviolet?logo=spdx)](https://github.com/SumitDalavi/llm-output-arbitration/releases)

> **Maturity:** Functional Prototype
> _Consensus system that queries multiple LLMs simultaneously and uses arbitration logic to select the best output._

## Features
- Fully automated workflow.
- Secure, scalable architecture.
- Built-in telemetry and observability.

## Technologies
- Python, Asyncio

## Getting Started
Ensure you have the required dependencies installed on your system.

```bash
# Setup & Test
pip install -r requirements.txt
pytest
```

## Architecture
Please see the [Architecture Document](docs/architecture.md) for sequence diagrams and system design details.


## CI & Reliability Updates (August 2026)

- **CI Pipeline Remediation:** Successfully resolved all CI/CD pipeline failures and established baseline CI workflows.
- **Specific Fix:** Added and configured robust GitHub Actions workflows for automated testing, linting, and formatting.
- **Status:** 🟩 Passing


## Mock Boundaries (Honest Scope)

| What | Status | Details |
|---|---|---|
| Arbitration Logic | **Real** | Cost-adjusted scoring and consensus algorithms are fully implemented. |
| API Interface | **Real** | FastAPI routes and background tasks work. |
| LLM Providers | **Mocked** | The LLM participants (GPT, Claude, Gemini) are abstracted; outputs are deterministically supplied by the test fixture. |

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — System diagram and component details
- [Runbook](docs/runbook.md) — Setup, commands, and expected outputs
- [Decisions](docs/decisions.md) — ADRs for arbitration strategy
- [Changelog](docs/changelog.md) — Change history

## Release & Verification

The project includes an automated DevSecOps release pipeline (`.github/workflows/release.yml`) triggered on semantic version tags (`v*.*.*`).

Each release automatically:
1. Executes test suite gates.
2. Builds the container image.
3. Performs vulnerability scanning via Trivy.
4. Generates an SPDX SBOM (`sbom.spdx.json`) using Anchore Syft.
5. Publishes a GitHub Release with attached SBOM.

### Verifying the Release
```bash
# Verify release via GitHub CLI
gh release view v0.1.0 --repo SumitDalavi/llm-output-arbitration

# Download and inspect SBOM
gh release download v0.1.0 --repo SumitDalavi/llm-output-arbitration --pattern "sbom.spdx.json"
cat sbom.spdx.json | jq .
```
