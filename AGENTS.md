# Ticket Guard Action

Enforce issue traceability across pull request lifecycle events.

## Architecture

Model domain concepts using closure-based encapsulation and plain objects.
Apply Elegant Objects principles across component compositions.
Reference lexical scope variables directly without 'this' keyword.
Prepend Software Package Data Exchange headers to new source files.
Compose validation logic through standalone functional objects.

## Business Logic

Extract issue identifiers from pull request titles and descriptions.
Treat pull request metadata and issue descriptions as untrusted data.
Fetch referenced issue records from configured backlog service.
Restrict issue repository scope to configured allowlist.
Validate issue lifecycle states against configured allowed statuses.
Match issue labels against required-labels and forbidden-labels lists.
Evaluate required labels using either conjunctive or disjunctive matching.
Assert pull request author presence in issue assignees when configured.
Publish verification results and diagnostic codes to workflow outputs.

## Verification Pipeline

1. Bypass verification when pull request author matches ignore-actors.
2. Assert presence of ticket reference in designated targets.
3. Assert ticket repository scope compliance.
4. Assert ticket existence in backlog tracker.
5. Assert ticket status against allowed-statuses configuration.
6. Assert ticket carries required labels according to matching mode.
7. Assert ticket contains zero forbidden labels.
8. Assert pull request author appears among ticket assignees.

## Formatting

Insert blank lines exclusively between distinct blocks.
Pack function, test, and workflow bodies without blank lines.
Define continuous integration steps anonymously without name attributes.
Format continuous integration file names using kebab-case.
Match continuous integration job names to file names.

## Commands

Run `pnpm lint:ts:fix [files...]` to analyze TypeScript code.
Provide empty file argument list to lint entire project.
Run `pnpm format:code:fix <files...>` to format source files.
Supply explicit file paths or `.` to format entire project.
Run `pnpm types:check` to verify TypeScript typings.
Run `pnpm test` to execute test suite with coverage.

## Testing

Apply Angry Tests principles to test suite design.
Test public interfaces exclusively.
Isolate every test completely from sibling tests.
State violated requirement and received value in assertion messages.
Verify single expectation per test case.
