/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

/**
 * Creates a passed {@link Check} indicating that validation succeeded.
 *
 * @param message - An optional custom explanation of the successful outcome.
 *
 * @returns A {@link Check} whose validity is `true` and reason is `'ok'`.
 */
export const ckOk = (message = 'Validation successful'): Check => ({
  message: () => message,
  reason: () => 'ok',
  valid: () => true,
});
