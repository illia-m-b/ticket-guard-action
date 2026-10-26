/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Grip } from '#grip/grip.ts';

import { stGrip } from '#grip/st-grip.ts';

import type { Ticket } from '../ticket.ts';
import type { IssuePayload } from './octokit.ts';

/**
 * Creates an {@link Ticket} adapting a GitHub REST API issue response.
 *
 * @param payload - Raw issue payload data from GitHub API.
 * @param grip - The {@link Grip} strategy governing evaluation and caching.
 *   Defaults to {@link stGrip}.
 *
 * @returns An {@link Ticket} exposing normalized ticket metadata.
 */
export const ghIssue = (
  payload: IssuePayload,
  grip: Grip<readonly string[]> = stGrip,
): Ticket => ({
  assignees: grip(() => payload.assignees?.map(({ login }) => login) ?? []),
  id: () => String(payload.number),
  labels: grip(() =>
    payload.labels.flatMap((label) => {
      const name = typeof label === 'string' ? label : label.name;
      return typeof name === 'string' ? name : [];
    }),
  ),
  present: () => true,
  status: () => payload.state,
  url: () => payload.html_url,
});
