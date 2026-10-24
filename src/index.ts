/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/* eslint-disable unicorn/max-nested-calls */

import { ticketGuard } from '#action/ticket-guard.ts';
import { ghIssues } from '#backlog/github/gh-issues.ts';
import { ckTraceability } from '#check/ck-traceability.ts';
import { ghInputs } from '#inputs/gh-inputs.ts';
import { rtOutputs } from '#outputs/rt-outputs.ts';
import { ghPullRequest } from '#pull-request/gh-pull-request.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';

const outputs = rtOutputs();
try {
  const { context, getOctokit } = await import('@actions/github');
  const {
    payload: { pull_request: pr },
    repo,
  } = context;
  if (!pr) {
    throw new TypeError(
      `Unsupported event "${context.eventName}". Ticket Guard action requires a "pull_request" event payload.`,
    );
  }
  const inputs = ghInputs();
  await ticketGuard(
    async () =>
      ckTraceability(
        inputs,
        ghPullRequest({
          payload: { pull_request: pr },
          repo,
        }),
        ghIssues(getOctokit(inputs.gitHubToken())),
        rfGitHub,
      ),
    outputs,
    inputs,
  ).run();
} catch (error: unknown) {
  outputs.fail(error instanceof Error ? error.message : String(error));
}
