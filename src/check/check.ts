/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents the evaluation outcome of a ticket or pull request check.
 *
 * Exposes accessors for check validity, machine-readable reason code, and a
 * human-readable diagnostic message.
 */
export interface Check {
  /**
   * Retrieves the human-readable explanation of the check outcome.
   *
   * @returns A descriptive message explaining the check result.
   */
  readonly message: () => string;

  /**
   * Retrieves the machine-readable reason code of the check outcome.
   *
   * @returns The outcome reason code.
   */
  readonly reason: () => Reason;

  /**
   * Indicates whether the check passed validation criteria.
   *
   * @returns `true` if the check passed; otherwise `false`.
   */
  readonly valid: () => boolean;
}

/**
 * Permissible machine-readable reason codes for check outcomes.
 *
 * @see {@link https://github.com/illia-m-b/ticket-guard-action/blob/main/action.yml | action.yml} for
 *   canonical error-message descriptions.
 */
export const REASONS = [
  'ok',
  'no-ticket-found',
  'ticket-not-found',
  'scope-violation',
  'missing-required-label',
  'forbidden-label',
  'status-not-allowed',
  'author-not-assigned',
  'unauthorized',
] as const;

/**
 * Machine-readable check reason type.
 */
export type Reason = (typeof REASONS)[number];
