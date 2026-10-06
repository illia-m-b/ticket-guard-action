/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Reference } from '#reference/reference.ts';

import type { Backlog } from '../backlog.ts';
import type { Ticket } from '../ticket.ts';
import type { Octokit } from './octokit.ts';

import { fkTicket } from '../fk-ticket.ts';
import { ghIssue } from './gh-issue.ts';

/**
 * Creates an {@link Backlog} backed by the GitHub REST API.
 *
 * @param octokit - Authenticated Octokit client instance.
 * @param owner - Target repository owner (organization or user).
 * @param repository - Target repository name.
 *
 * @returns An {@link Backlog} implementation retrieving issues via GitHub API.
 */
export const ghIssues = (
  octokit: Octokit,
  owner: string,
  repository: string,
): Backlog => ({
  ticket: async (reference: Reference): Promise<Ticket> => {
    if (!reference.present()) {
      return fkTicket();
    }
    try {
      const payload = await octokit.rest.issues.get({
        issue_number: reference.number(),
        owner,
        repo: repository,
      });
      return ghIssue(payload.data);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 404
      ) {
        return fkTicket();
      }
      throw error;
    }
  },
});
