/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Scope } from '#inputs/inputs.ts';
import type { Repository } from '#repository/repository.ts';

import type { Check } from './check.ts';

import { ckBypassed } from './ck-bypassed.ts';
import { ckFailed } from './ck-failed.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a {@link Check} verifying that the referenced ticket repository
 * coordinates satisfy the required scoping policy relative to the target
 * repository.
 *
 * Scoping rules:
 *
 * - `'any'`: Any ticket repository is permitted (bypassed with {@link ckOk}).
 * - `'same-org'`: The ticket repository owner must match the target repository
 *   owner.
 * - `'current-repo'`: Both owner and repository name must match the target
 *   repository.
 *
 * If ticket coordinates cannot be extracted from an external or unresolvable
 * repository, validation fails with `'scope-violation'`.
 *
 * @param scope - The {@link Scope} policy to enforce.
 * @param target - The pull request target {@link Repository}.
 * @param ticket - The referenced ticket {@link Repository}.
 *
 * @returns A {@link Check} representing the scope evaluation outcome.
 */
export const ckScope = (
  scope: Scope,
  target: Repository,
  ticket: Repository,
): Check =>
  ckBypassed(
    () => scope === 'any',
    () => {
      try {
        if (scope === 'same-org') {
          return target.owner() === ticket.owner()
            ? ckOk()
            : ckFailed(
                'scope-violation',
                `Scope violation: ticket owner "${ticket.owner()}" does not match target organization "${target.owner()}". Scope is set to "same-org".`,
              );
        }
        return target.owner() === ticket.owner() &&
          target.name() === ticket.name()
          ? ckOk()
          : ckFailed(
              'scope-violation',
              `Scope violation: ticket belongs to "${ticket.owner()}/${ticket.name()}", but pull request targets "${target.owner()}/${target.name()}". Scope is set to "current-repo".`,
            );
      } catch {
        return ckFailed(
          'scope-violation',
          `Scope violation: ticket repository coordinates cannot be determined. Scope is set to "${scope}".`,
        );
      }
    },
    'Validation bypassed: scope is set to "any"',
  );
