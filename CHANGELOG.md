# Changelog

## 0.0.0 (2026-10-18)


### Features


* **Issue Reference Extraction**: Automatically detect local issue numbers (`#42`), cross-repository references (`owner/repo#42`), and full GitHub issue URLs from pull request titles and descriptions.
* **Scope Boundary Enforcement**: Restrict accepted ticket references to `current-repo`, `same-org`, or `any` repository.
* **Lifecycle State Verification**: Enforce ticket status requirements (e.g. Link only `open` issues).
* **Label Governance**:
    * Assert mandatory issue labels using `require-all-labels: true` or `require-all-labels: false` (any-of matching).
    * Reject pull requests referencing tickets with forbidden labels (e.g. `wontfix`, `blocked`, `duplicate`).
* **Author Assignment Check**: Optional verification (`require-author-assigned: 'true'`) ensuring the pull request author is an assignee on the linked ticket.
* **Automated Bot Bypasses**: Automatically exempt automated actors (e.g. `dependabot[bot]`, `renovate[bot]`) from ticket validation.
* **Machine-Readable Outputs**: Export diagnostic status codes (`error-message`) and ticket metadata (`ticket-id`, `ticket-url`, `ticket-status`, `ticket-labels`, `is-valid`) for downstream workflow steps (e.g., sticky PR feedback comments).
