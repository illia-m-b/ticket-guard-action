/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Canonical GitHub Action output parameter names matching
 * {@link https://github.com/illia-m-b/ticket-guard-action/blob/main/action.yml | action.yml}.
 */
export const OUTPUTS = [
  'error-message',
  'is-valid',
  'ticket-id',
  'ticket-labels',
  'ticket-status',
  'ticket-url',
] as const;

/**
 * Action output parameter name type.
 */
export type Output = (typeof OUTPUTS)[number];

/**
 * Action workflow outputs and diagnostics emission boundary.
 *
 * Exposes methods to emit step outputs and diagnostic log messages to the
 * runner environment.
 */
export interface Outputs {
  /**
   * Emits a low-priority debug message to the runner log.
   *
   * @param message - The debug message text.
   */
  readonly debug: (message: string) => void;

  /**
   * Emits an error-level annotation to the workflow log without failing the
   * step.
   *
   * @param message - The error message text or {@link Error} instance.
   */
  readonly error: (message: Error | string) => void;

  /**
   * Marks the workflow step as failed and emits a failure message.
   *
   * @param message - The failure explanation or {@link Error} instance.
   */
  readonly fail: (message: Error | string) => void;

  /**
   * Emits an informational message to the runner log.
   *
   * @param message - The informational message text.
   */
  readonly info: (message: string) => void;

  /**
   * Emits a notice annotation to the runner log.
   *
   * @param message - The notice message text or {@link Error} instance.
   */
  readonly notice: (message: Error | string) => void;

  /**
   * Publishes a named workflow output parameter.
   *
   * @param name - The action output parameter name.
   * @param value - The value to assign to the output parameter.
   */
  readonly output: (name: Output, value: string) => void;

  /**
   * Emits a warning annotation to the runner log.
   *
   * @param message - The warning message text or {@link Error} instance.
   */
  readonly warn: (message: Error | string) => void;
}
