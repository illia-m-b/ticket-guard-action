<!--
SPDX-FileCopyrightText: 2026 Illia Brashkin
SPDX-License-Identifier: MIT
-->

# Contributing to Ticket Guard Action

Thank you for contributing to Ticket Guard Action.

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating in
this project.

## Reporting Bugs and Requesting Features

Before submitting a new issue, search [existing issues][issues] to check if a
similar ticket already exists.

When creating an issue:

1. Use a clear and descriptive title.
2. Provide a reproduction script or workflow snippet for bugs.
3. Include relevant runner environment details and error logs.
4. Submit the issue via the [issue tracker][new-issue].

## Principles and Guidelines

This project strictly adheres to:

- [Elegant Objects][eo] architectural principles (closure-based encapsulation,
  immutable plain old JavaScript objects, no `this` keyword).
- [Angry Tests][angry-tests] testing practices (isolated unit tests, 100% test
  coverage, one expectation per test, negative assertion phrasing).

## Local Development Setup

To configure your development environment:

1. [Fork][fork] this repository and clone your fork.
2. Ensure you have the exact runtime versions of [Node.js][node]
   and [PNPM][pnpm] specified in [`devEngines`](package.json).
   PNPM [manages][runtime-management] Node.js runtime downloads automatically.

3. Install project dependencies:

   ```bash
   pnpm install
   ```

4. Install local [Git hooks][lefthook]:

   ```bash
   pnpm lefthook install
   ```

## Development Workflow

1. **Create an Issue**: Every pull request must trace back to an existing issue.
   If one does not exist, open an issue first.
2. **Branch Naming**: Create a branch named after the issue number integer (for
   example, `123`):

   ```bash
   git switch -c 123
   ```

3. **Practice TDD**: Write a failing unit test that reproduces the bug or
   verifies the new behavior before writing implementation code.
4. **Adhere to Code Standards**:
   - Maintain 100% test coverage across statements, branches, functions, and
     lines.
   - Keep console logging out of test suites.
   - Avoid blank lines inside function and test bodies.
   - Prepend [SPDX][reuse] headers to all new source files.

## Available Commands

Run these commands locally to verify your changes:

| Command                                       | Purpose                                           |
| :-------------------------------------------- | :------------------------------------------------ |
| `pnpm build`                                  | Bundle action assets using [tsdown].              |
| `pnpm test`                                   | Run test suite and check 100% coverage threshold. |
| `pnpm test:watch`                             | Run test suite in watch mode.                     |
| `pnpm types:check`                            | Check TypeScript types with `tsc`.                |
| `pnpm lint:ts:check`                          | Check TypeScript files with [ESLint].             |
| `pnpm lint:ts:fix`                            | Fix autofixable [ESLint] errors.                  |
| `pnpm format:code:check`                      | Verify [Prettier] code formatting.                |
| `pnpm format:code:fix <files...>`             | Format code with [Prettier].                      |
| `pnpm lint:agents`                            | Lint [`AGENTS.md`](AGENTS.md) with [dogent].      |
| `pnpm exec lefthook run pre-push --all-files` | Run all pre-push verification checks.             |

## Pull Request Submission

Before submitting your pull request:

1. Confirm that the repository [CI pipeline][status] on `main` is passing.
2. Ensure all pre-push hooks succeed locally:

   ```bash
   pnpm exec lefthook run pre-push --all-files
   ```

3. Format your pull request title using
   [Conventional Commits][conventional-commits] syntax (for example,
   `feat(matcher): add regex support` or `fix(scope): handle empty org`).
   Ensure the subject is lowercase and does not end with an issue ticket number.
4. Reference the corresponding issue number in the pull request description (for
   example, `Closes #123`).
5. Open your [pull request][pr].

[angry-tests]: https://www.yegor256.com/angry-tests.html
[conventional-commits]: https://www.conventionalcommits.org/
[dogent]: https://github.com/yegor256/dogent
[eo]: https://www.elegantobjects.org/
[eslint]: https://eslint.org/
[fork]: https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo
[issues]: https://github.com/illia-m-b/ticket-guard-action/issues
[lefthook]: https://lefthook.dev/
[new-issue]: https://github.com/illia-m-b/ticket-guard-action/issues/new/choose
[node]: https://nodejs.org/en/download
[pnpm]: https://pnpm.io/
[pr]: https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request
[prettier]: https://prettier.io/
[reuse]: https://reuse.software/
[runtime-management]: https://pnpm.io/cli/runtime
[status]: https://github.com/illia-m-b/ticket-guard-action/actions
[tsdown]: https://tsdown.dev/
