/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { RpParameters } from '#repository/repository.ts';

import { rpPlain } from '#repository/rp-plain.ts';

describe('Plain text repository coordinates', { concurrency: true }, () => {
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
    assert.deepStrictEqual(
      coordinates,
      lowercased,
      'Repository coordinates differs from original lowercased ones',
    );
  });
});
