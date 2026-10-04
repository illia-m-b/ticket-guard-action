/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents an issue tracker ticket under evaluation.
 *
 * Exposes accessors for ticket state, metadata, and presence required by
 * business validation rules.
 */
export interface Ticket {
  /**
   * Retrieves usernames of users assigned to the ticket.
   *
   * @returns A list of assigned usernames.
   */
  readonly assignees: () => readonly string[];

  /**
   * Retrieves the label names attached to the ticket.
   *
   * @returns A list of label names.
   */
  readonly labels: () => readonly string[];

  /**
   * Retrieves the numeric ticket identifier.
   *
   * @returns The ticket number.
   *
   * @throws TypeError - If the ticket is absent (not present).
   */
  readonly number: () => number;

  /**
   * Indicates whether the ticket exists and was successfully retrieved.
   *
   * @returns `true` if the ticket exists in the tracker; otherwise `false`.
   */
  readonly present: () => boolean;

  /**
   * Retrieves the current state/status of the ticket (e.g., `open`, `closed`).
   *
   * @returns The ticket status.
   */
  readonly status: () => string;

  /**
   * Retrieves the canonical direct URL to the ticket in the tracker.
   *
   * @returns The ticket URL.
   */
  readonly url: () => string;
}
