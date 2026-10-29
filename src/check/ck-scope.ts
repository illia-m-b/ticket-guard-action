/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Repository } from '#repository/repository.ts';

import type { Check } from './check.ts';

import { ckAssert } from './ck-assert.ts';
import { ckEnvelope } from './ck-envelope.ts';
import { ckFailed } from './ck-failed.ts';

/**
 * Creates a {@link Check} verifying that the referenced ticket repository
 * coordinates satisfy the configured scope allowlist.
 *
 * @param scopes - The list of permitted repository coordinates.
 * @param ticket - The referenced ticket {@link Repository}.
 *
 * @returns A {@link Check} representing the scope evaluation outcome.
 */
export const ckScope = (scopes: readonly string[], ticket: Repository): Check =>
  ckEnvelope(() => {
    try {
      const key = `${ticket.owner()}/${ticket.name()}`.toLowerCase();
      return ckAssert(
        () => scopes.some((scope) => scope.toLowerCase() === key),
        () =>
          ckFailed(
            'scope-violation',
            `Scope violation: ticket repository "${key}" is not permitted by scope policy`,
          ),
      );
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        return ckFailed(
          'scope-violation',
          'Scope violation: ticket repository coordinates cannot be determined',
        );
      }
      throw error;
    }
  });
