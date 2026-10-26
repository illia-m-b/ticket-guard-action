/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Executable workflow action contract.
 *
 * Encapsulates an asynchronous operation performed within the GitHub Actions
 * runner lifecycle.
 */
export interface Action {
  /**
   * Executes the action asynchronously.
   *
   * @returns A promise that resolves when the action execution completes.
   */
  readonly run: () => Promise<void>;
}
