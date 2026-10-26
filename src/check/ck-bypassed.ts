/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a {@link Check} that conditionally bypasses validation.
 *
 * If `shouldBypass` is `true`, validation immediately succeeds with {@link ckOk}
 * using the specified message. Otherwise, delegates to the wrapped check.
 *
 * @param shouldBypass - Whether validation should be bypassed.
 * @param origin - The supplier function that returns a fallback {@link Check} to
 *   evaluate when not bypassed.
 * @param message - An optional custom explanation of the bypass outcome.
 *   Defaults to `'Validation bypassed'`.
 *
 * @returns A {@link Check} representing the bypassed or delegated outcome.
 */
export const ckBypassed = (
  shouldBypass: () => boolean,
  origin: () => Check,
  message = 'Validation bypassed',
): Check => ckEnvelope(() => (shouldBypass() ? ckOk(message) : origin()));
