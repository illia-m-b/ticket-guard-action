/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';
import { rpPlain } from '#repository/rp-plain.ts';
import { rpReference } from '#repository/rp-reference.ts';

describe('a reference repository resolver', () => {
  it('fails when resolving coordinates of an empty reference', () => {
    const fallback = rpPlain({ owner: 'octo-org', repo: 'octo-repo' });
    const repository = rpReference(rfEmpty(), fallback);

    expect(
      () => repository.name(),
      'Resolving repository coordinates of an empty reference did not throw TypeError',
    ).toThrow(new TypeError('Reference is empty'));
  });

  it('delegates to fallback repository when reference is shorthand numeric identifier', () => {
    const fallback = rpPlain({ owner: 'octo-org', repo: 'octo-repo' });
    const reference = rfGitHub('fixes #143');
    const repository = rpReference(reference, fallback);
    const actual = {
      name: repository.name(),
      owner: repository.owner(),
    };
    const expected = {
      name: 'octo-repo',
      owner: 'octo-org',
    };

    expect(
      actual,
      'The resolved repository coordinates did not match the provided fallback repository',
    ).toStrictEqual(expected);
  });

  it('extracts coordinates from scoped autolink reference', () => {
    const fallback = rpPlain({ owner: 'octo-org', repo: 'octo-repo' });
    const reference = rfGitHub('see avajs/ava#1023');
    const repository = rpReference(reference, fallback);
    const actual = {
      name: repository.name(),
      owner: repository.owner(),
    };
    const expected = {
      name: 'ava',
      owner: 'avajs',
    };

    expect(
      actual,
      'The resolved repository coordinates did not match the scoped autolink reference',
    ).toStrictEqual(expected);
  });

  it('extracts coordinates from canonical issue URL', () => {
    const fallback = rpPlain({ owner: 'octo-org', repo: 'octo-repo' });
    const reference = rfGitHub('https://github.com/nodejs/node/issues/52109');
    const repository = rpReference(reference, fallback);
    const actual = {
      name: repository.name(),
      owner: repository.owner(),
    };
    const expected = {
      name: 'node',
      owner: 'nodejs',
    };

    expect(
      actual,
      'The resolved repository coordinates did not match the canonical issue URL',
    ).toStrictEqual(expected);
  });
});
