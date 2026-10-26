/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Reference } from '#reference/reference.ts';

import type { Repository } from './repository.ts';

import { rpEnvelope } from './rp-envelope.ts';
import { rpUrl } from './rp-url.ts';

/**
 * Creates a {@link Repository} resolved from an issue reference and its fallback
 * context.
 *
 * If the reference starts with `#`, delegates coordinates to the fallback
 * repository. If the reference is scoped (e.g. `owner/repo#123` or a GitHub
 * URL), coordinates are parsed via {@link rpUrl}.
 *
 * @param reference - The candidate ticket reference.
 * @param fallback - The contextual repository when reference is unscoped.
 *
 * @returns A {@link Repository} exposing coordinates for the referenced ticket.
 *
 * @throws TypeError - If the reference is empty (not present).
 */
export const rpReference = (
  reference: Reference,
  fallback: Repository,
): Repository =>
  rpEnvelope(() => {
    if (!reference.present()) {
      throw new TypeError('Reference is empty');
    }
    const raw = reference.raw();
    return raw.startsWith('#') ? fallback : rpUrl(raw);
  });
