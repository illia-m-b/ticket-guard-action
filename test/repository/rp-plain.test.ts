/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { RpParameters } from '#repository/repository.ts';

import { rpPlain } from '#repository/rp-plain.ts';

describe('plain text repository coordinates', () => {
  it('returns lowercased owner and repository name provided', () => {
    const original: RpParameters = {
      owner: 'OnPm',
      repo: 'MyAWESOMErepo',
    };
    const lowercased = {
      owner: original.owner.toLowerCase(),
      repo: original.repo.toLowerCase(),
    };
    const repository = rpPlain(original);
    const coordinates = {
      owner: repository.owner(),
      repo: repository.name(),
    };

    expect(
      coordinates,
      'Repository coordinates differs from original lowercased ones',
    ).toStrictEqual(lowercased);
  });
});
