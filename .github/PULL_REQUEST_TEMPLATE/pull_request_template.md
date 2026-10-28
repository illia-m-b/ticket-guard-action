## Ticket Reference

<!-- Every pull request must trace back to an existing issue. -->

Closes #

## What Changed

<!-- Concise, direct human prose in full sentences. -->

## Integrity Checklist

Review our [Contributing Guidelines](https://github.com/illia-m-b/ticket-guard-action/blob/main/CONTRIBUTING.md) before submitting:

- [ ] Traceability: branch is named after the issue number integer (e.g. `123`)
- [ ] TDD: failing test added first
- [ ] Coverage: 100% test coverage maintained across statements, branches, functions, and lines
- [ ] Convention: title adheres to Conventional Commits (lowercase subject, no issue suffix)
- [ ] Objects: immutable objects, closure-based encapsulation, no `this`, no empty lines in functions
- [ ] Verification: ran `pnpm exec lefthook run pre-push --all-files` with zero warnings
