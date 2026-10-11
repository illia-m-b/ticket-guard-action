/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Ticket } from '../ticket.ts';
import type { IssuePayload } from './octokit.ts';

/**
 * Creates an {@link Ticket} adapting a GitHub REST API issue response.
 *
 * @param payload - Raw issue payload data from GitHub API.
 *
 * @returns An {@link Ticket} exposing normalized ticket metadata.
 */
export const ghIssue = (payload: IssuePayload): Ticket => ({
  assignees: () => payload.assignees?.map(({ login }) => login) ?? [],
  id: () => String(payload.number),
  labels: () =>
    payload.labels.flatMap((label) => {
      const name = typeof label === 'string' ? label : label.name;
      return typeof name === 'string' ? name : [];
    }),
  present: () => true,
  status: () => payload.state,
  url: () => payload.html_url,
});
