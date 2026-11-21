# Changelog

## [1.0.1](https://github.com/illia-m-b/ticket-guard-action/compare/v1.0.0...v1.0.1) (2026-11-21)


### Performance Improvements

* **stryker:** speed up mutation testing and simplify CI cache ([#283](https://github.com/illia-m-b/ticket-guard-action/issues/283)) ([0121fdd](https://github.com/illia-m-b/ticket-guard-action/commit/0121fddfae1acf89301f4737527e19a8960c7881))

## 1.0.0 (2026-10-31)


### Features

* **Traceability Verification**: Automatically extracts and verifies GitHub issue references from pull request titles and descriptions.
* **Repository Scope Control**: Enforces repository boundary compliance using an allowlist of repository coordinates.
* **Status Enforcement**: Validates ticket lifecycle state (`open`, `closed`) against configured requirements.
* **Flexible Label Rules**: Asserts required issue labels using conjunctive (`AND`) or disjunctive (`OR`) matching, and rejects forbidden labels.
* **Author Assignment Guard**: Validates that the pull request author is explicitly assigned to referenced tickets.
* **Actor Bypass**: Supports exemptions for automated dependency bots (e.g., `dependabot[bot]`, `renovate[bot]`).
* **Audit & Diagnostics**: Publishes structured, machine-readable step outputs and error codes with optional non-blocking audit mode.
