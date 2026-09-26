/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents a reference to an issue tracker ticket identified within text.
 */
export interface Reference {
  /**
   * Retrieves the numeric issue identifier.
   *
   * @returns The issue number.
   *
   * @throws TypeError - If the reference is empty (not present).
   */
  readonly number: () => number;

  /**
   * Indicates whether a valid issue reference was identified.
   *
   * @returns `true` if a valid reference was matched; otherwise `false`.
   */
  readonly present: () => boolean;

  /**
   * Retrieves the raw matched substring as it appeared in the source text.
   *
   * @returns The raw matched string, or an empty string if not present.
   */
  readonly raw: () => string;
}
