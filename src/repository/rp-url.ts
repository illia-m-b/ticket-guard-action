/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Repository } from './repository.ts';

import { rpEnvelope } from './rp-envelope.ts';
import { rpPlain } from './rp-plain.ts';

/**
 * Creates a {@link Repository} parsed from a GitHub URL or scoped reference.
 *
 * Evaluation is deferred and memoized through {@link rpEnvelope}.
 *
 * @param url - The GitHub URL or scoped ticket reference string to parse.
 *
 * @returns A {@link Repository} exposing normalized coordinates parsed from the
 *   URL.
 *
 * @throws TypeError - If repository coordinates cannot be extracted from the
 *   URL.
 */
export const rpUrl = (url: string): Repository =>
  rpEnvelope(() => {
    const match =
      /(?<![^\s<([{"'`])(?:https:\/\/github\.com\/|http:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/|git:\/\/github\.com\/)?(?<owner>[a-z\d_-]+)\/(?<name>[a-z\d_.-]*[a-z\d_-])(?=[/?#\s>)}\]"'`.,!;]|$)/i.exec(
        url,
      );
    const owner = match?.groups?.owner;
    const name = match?.groups?.name;
    if (match === null || owner === undefined || name === undefined) {
      throw new TypeError(
        `Cannot extract repository coordinates from URL: "${url}"`,
      );
    }
    return rpPlain({ owner, repo: name.replace(/\.git$/i, '') });
  });
