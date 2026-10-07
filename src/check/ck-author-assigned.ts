/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckFailed } from './ck-failed.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a {@link Check} verifying that the pull request author is assigned to
 * the ticket.
 *
 * Matching is case-insensitive. If the author is present among the ticket
 * assignees, validation succeeds with {@link ckOk}. If the author is not
 * assigned, validation fails with reason code `'author-not-assigned'`.
 *
 * @param author - The pull request author username to evaluate.
 * @param assignees - The list of assigned ticket usernames.
 *
 * @returns A {@link Check} representing the author assignment outcome.
 */
export const ckAuthorAssigned = (
  author: string,
  assignees: readonly string[],
): Check =>
  ckEnvelope(() => {
    const desired = author.toLowerCase();
    return assignees.some((assignee) => assignee.toLowerCase() === desired)
      ? ckOk()
      : ckFailed(
          'author-not-assigned',
          `The author "${author}" is not among assignees. The current list of assignees: ${JSON.stringify(assignees)}`,
        );
  });
