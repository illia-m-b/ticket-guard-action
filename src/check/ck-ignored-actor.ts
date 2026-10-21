/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckFailed } from './ck-failed.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a {@link Check} verifying whether the pull request author is listed in
 * `ignore-actors`.
 *
 * Matching is case-insensitive. If the author is listed among the ignored
 * actors, validation succeeds with {@link ckOk}. If the author is not listed,
 * validation fails.
 *
 * @param author - The pull request author username to evaluate.
 * @param actors - The list of exempt usernames or bot names.
 *
 * @returns A {@link Check} representing the ignored-actor evaluation outcome.
 */
export const ckIgnoredActor = (
  author: string,
  actors: readonly string[],
): Check =>
  ckEnvelope(() => {
    const desired = author.toLowerCase();
    return actors.some((actor) => actor.toLowerCase() === desired)
      ? ckOk(`Validation bypassed: author "${author}" is in ignore-actors`)
      : ckFailed('ok', `Author "${author}" is not in ignore-actors`);
  });
