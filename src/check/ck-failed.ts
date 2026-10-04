/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check, Reason } from './check.ts';

/**
 * Creates a failed {@link Check} indicating that validation failed.
 *
 * @param reason - The machine-readable failure reason code.
 * @param message - A human-readable description explaining the failure.
 *
 * @returns A {@link Check} whose validity is `false`.
 */
export const ckFailed = (reason: Reason, message: string): Check => ({
  message: () => message,
  reason: () => reason,
  valid: () => false,
});
