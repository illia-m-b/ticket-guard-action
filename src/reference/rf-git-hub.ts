/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Reference } from './reference.ts';

import { rfEmpty } from './rf-empty.ts';
import { rfEnvelope } from './rf-envelope.ts';

/**
 * Creates an issue reference extracted from an arbitrary text string.
 *
 * @param text - The raw text to scan for issue references.
 *
 * @returns A present {@link Reference} if a pattern matches; otherwise
 *   {@link rfEmpty}.
 */
export const rfGitHub = (text: string): Reference =>
  rfEnvelope(() => {
    const match =
      /(?<![^\s<([{"'`:])(?:https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/issues\/|[a-z\d_.-]+\/[a-z\d_.-]+#|#)(?<number>[1-9]\d{0,9})\b/i.exec(
        text,
      );
    const number = match?.groups?.number;
    if (match === null || number === undefined) {
      return rfEmpty();
    }
    return {
      number: () => Number(number),
      present: () => true,
      raw: () => match[0],
    };
  });
