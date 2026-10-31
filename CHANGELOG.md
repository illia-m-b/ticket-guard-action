# Changelog

## 1.0.0 (2026-10-31)


### Features

* **Traceability Verification**: Automatically extracts and verifies GitHub issue references from pull request titles and descriptions.
* **Repository Scope Control**: Enforces repository boundary compliance using an allowlist of repository coordinates.
* **Status Enforcement**: Validates ticket lifecycle state (`open`, `closed`) against configured requirements.
* **Flexible Label Rules**: Asserts required issue labels using conjunctive (`AND`) or disjunctive (`OR`) matching, and rejects forbidden labels.
* **Author Assignment Guard**: Validates that the pull request author is explicitly assigned to referenced tickets.
* **Actor Bypass**: Supports exemptions for automated dependency bots (e.g., `dependabot[bot]`, `renovate[bot]`).
* **Audit & Diagnostics**: Publishes structured, machine-readable step outputs and error codes with optional non-blocking audit mode.
