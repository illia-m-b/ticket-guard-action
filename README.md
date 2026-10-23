# Ticket Guard Action

_Traceability enforcer—validates business state, labels, and lifecycle status of
issues referenced in pull requests._

[![EO principles respected here](https://www.elegantobjects.org/badge.svg)](https://www.elegantobjects.org)

[![CI](https://img.shields.io/github/actions/workflow/status/illia-m-b/ticket-guard-action/pnpm.yml?branch=main&label=CI)](https://github.com/illia-m-b/ticket-guard-action/actions/workflows/pnpm.yml)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-3c873a)](https://nodejs.org)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)](https://github.com/illia-m-b/ticket-guard-action/blob/main/vitest.config.ts)
[![Mutation score](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fillia-m-b%2Fticket-guard-action%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/illia-m-b/ticket-guard-action/main)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/illia-m-b/ticket-guard-action/blob/main/LICENSE.txt)

[Features](#features) &bull;
[Quick Start](#quick-start) &bull;
[Inputs](#inputs) &bull;
[Outputs](#outputs) &bull;
[Examples](#examples)

**Ticket Guard Action** enforces development traceability across pull requests.
It extracts issue references from PR titles and descriptions, queries the GitHub
Issues API, and validates the ticket's repository scope, lifecycle status,
mandatory/forbidden labels, and author assignment.

> [!NOTE]
> This action runs under the `pull_request` event and requires read permissions
> for repository issues and pull requests:
>
> ```yaml
> contents: read
> issues: read
> pull-requests: read
> ```

## Features

- **Automated Reference Extraction**: Detects local issue references (e.g.
  `#42`), cross-repository references (e.g. `owner/repo#42`), and canonical
  GitHub issue URLs in pull request titles and descriptions.
- **Repository Scope Boundary**: Restricts referenced tickets to `current-repo`,
  `same-org`, or `any`.
- **Status & Lifecycle Verification**: Ensures pull requests only link to
  tickets matching specified statuses (defaults to `open`).
- **Label Governance**: Validates presence of mandatory labels (matching all or
  any) and asserts that forbidden labels (e.g., `wontfix`, `blocked`) are
  absent.
- **Author Assignment Checks**: Optionally ensures that the author of the pull
  request is assigned to the corresponding issue.
- **Automated Actor Exemption**: Automatically bypasses validation for automated
  bots (e.g., `dependabot[bot]`, `renovate[bot]`).
- **Machine-Readable Outputs**: Emits diagnostic codes and resolved ticket
  metadata for downstream workflow steps.

## Quick Start

Add the action to your `.github/workflows/ticket-guard.yml`:

```yaml
name: ticket-guard
'on':
  pull_request:
    types:
      - opened
      - reopened
      - edited
      - synchronize
jobs:
  ticket-guard:
    runs-on: ubuntu-slim
    permissions:
      contents: read
      issues: read
      pull-requests: read
    steps:
      - uses: illia-m-b/ticket-guard-action@v0 # x-release-please-major
```

## Inputs

| Input                     | Description                                                                                                                            | Required | Default                              |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------- | :------: | :----------------------------------- |
| `github-token`            | GitHub token used to authenticate API requests.                                                                                        |    No    | `${{ github.token }}`                |
| `scope`                   | Allowed repository scope for tickets: `current-repo`, `same-org`, or `any`. Cross-repo validation requires an elevated token.          |    No    | `current-repo`                       |
| `extract-from`            | Locations to scan for references (`pr-title`, `pr-body`). Multi-line input.                                                            |    No    | `pr-title`<br>`pr-body`              |
| `required-labels`         | List of labels required on the issue (one per line).                                                                                   |    No    | `''`                                 |
| `require-all-labels`      | If `'true'`, ticket must contain **all** labels in `required-labels`. If `'false'`, matching **any** single label satisfies the check. |    No    | `'false'`                            |
| `forbidden-labels`        | List of labels that reject the PR if present on the issue (e.g. `wontfix`, `blocked`). One per line.                                   |    No    | `''`                                 |
| `allowed-statuses`        | Allowed ticket lifecycle states (one per line, e.g. `open`, `closed`).                                                                 |    No    | `open`                               |
| `require-author-assigned` | Asserts that the PR author is an assignee on the ticket.                                                                               |    No    | `'false'`                            |
| `ignore-actors`           | List of GitHub usernames or bots exempt from validation (one per line).                                                                |    No    | `dependabot[bot]`<br>`renovate[bot]` |
| `fail-on-error`           | Whether to fail the workflow step when validation fails. Set to `'false'` for audit-only runs.                                         |    No    | `'true'`                             |

> [!WARNING]
> External fork contributors without write/triage permissions cannot be assigned
> to repository issues. Enabling `require-author-assigned: 'true'` will fail
> pull requests submitted from public forks.

## Outputs

| Output          | Description                                                                                 | Example                                   |
| :-------------- | :------------------------------------------------------------------------------------------ | :---------------------------------------- |
| `is-valid`      | `'true'` if the ticket passed all verification criteria; `'false'` otherwise.               | `'true'`                                  |
| `ticket-id`     | Resolved primary ticket identifier. Empty string if no ticket was matched.                  | `'42'` or `'owner/repo#42'`               |
| `ticket-url`    | Canonical URL to the resolved GitHub issue.                                                 | `'https://github.com/org/repo/issues/42'` |
| `ticket-status` | Current lifecycle status of the ticket.                                                     | `'open'`                                  |
| `ticket-labels` | JSON string array of labels attached to the resolved ticket.                                | `'["bug", "triage"]'`                     |
| `error-message` | Machine-readable failure reason code when validation fails; empty string (`''`) on success. | `''` or `'no-ticket-found'`               |

### Error Reason Codes

When validation succeeds, `error-message` is empty (`''`). When validation
fails,`error-message` contains one of the following machine-readable codes:

- `no-ticket-found`: No issue reference was detected in the specified extraction
  targets.
- `ticket-not-found`: The issue reference could not be found via the GitHub API
  (e.g. 404).
- `scope-violation`: The issue belongs to a repository outside the allowed
  `scope`.
- `missing-required-label`: The issue is missing required labels.
- `forbidden-label`: The issue contains a forbidden label.
- `status-not-allowed`: The issue status does not match `allowed-statuses`.
- `author-not-assigned`: The PR author is not listed as an assignee on the
  issue.
- `unauthorized`: Insufficient API token permissions to access the issue.

## Examples

### Enforcing Specific Labels

Require linked issues to have either `ready-for-dev` or `accepted`, while
rejecting any issue marked `duplicate` or `wontfix`:

```yaml
- uses: illia-m-b/ticket-guard-action@v0 # x-release-please-major
  with:
    required-labels: |
      ready-for-dev
      accepted
    require-all-labels: false
    forbidden-labels: |
      duplicate
      wontfix
```

### Automated PR Feedback (Sticky Comments)

Run Ticket Guard with `fail-on-error: false` to provide helpful feedback when a
pull request is opened without an associated issue:

```yaml
name: ticket-guard
'on':
  pull_request:
    types:
      - opened
      - reopened
      - edited
      - synchronize
permissions:
  contents: read
  issues: read
  pull-requests: write
jobs:
  ticket-guard:
    runs-on: ubuntu-slim
    steps:
      - uses: illia-m-b/ticket-guard-action@v0 # x-release-please-major
        id: guard
        with:
          fail-on-error: false

      - name: Explain missing ticket
        if: steps.guard.outputs.is-valid == 'false'
        uses: marocchino/sticky-pull-request-comment@v3
        with:
          header: ticket-guard-notice
          message: |
            Thank you for opening this pull request! 👋

            We require all pull requests to link to an approved issue to ensure
            development traceability and confirm the proposed change aligns with
            project plans. Please reference an issue in your pull request title
            or body (e.g., `Closes #123` or `Fixes org/repo#123`).

            **Details**: `${{ steps.guard.outputs.error-message }}`

      # Automatically remove notice once an issue is linked
      - name: Clear notice
        if: steps.guard.outputs.is-valid == 'true'
        uses: marocchino/sticky-pull-request-comment@v3
        with:
          header: ticket-guard-notice
          delete: true
```
