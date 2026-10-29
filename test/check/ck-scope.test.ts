/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckFailed } from '#check/ck-failed.ts';
import { ckScope } from '#check/ck-scope.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a scope verification check', () => {
  it('passes when ticket matches allowlist coordinates', () => {
    const ticket = rpPlain({ owner: 'octo-org', repo: 'app_7x' });
    const actual = ckScope(['octo-org/app_7x'], ticket);
    expect(
      actual.valid(),
      'A scope verification check failed when ticket matches allowlist coordinates',
    ).toBe(true);
  });

  it('passes when ticket matches dedicated external backlog repository', () => {
    const ticket = rpPlain({ owner: 'octo-org', repo: 'backlog_9z' });
    const actual = ckScope(['octo-org/backlog_9z'], ticket);
    expect(
      actual.valid(),
      'A scope verification check failed when ticket matches dedicated backlog repository',
    ).toBe(true);
  });

  it('passes when ticket matches one entry in a multi-repository allowlist', () => {
    const ticket = rpPlain({ owner: 'acme-shared', repo: 'tickets' });
    const actual = ckScope(
      ['acme-inc/core', 'acme-shared/tickets', 'acme-inc/roadmap'],
      ticket,
    );
    expect(
      actual.valid(),
      'A scope verification check failed when ticket matches multi-repository allowlist entry',
    ).toBe(true);
  });

  it('fails when ticket repository is not present in allowlist', () => {
    const ticket = rpPlain({ owner: 'stranger-danger', repo: 'fake-issues' });
    const actual = ckScope(['octo-org/app_7x'], ticket);
    const expected = ckFailed(
      'scope-violation',
      'Scope violation: ticket repository "stranger-danger/fake-issues" is not permitted by scope policy',
    );
    expect(
      actual.message(),
      'A scope verification check did not fail when ticket repository is not in allowlist',
    ).toBe(expected.message());
  });

  it('fails with scope-violation reason code when check fails', () => {
    const ticket = rpPlain({ owner: 'other-org', repo: 'repo-2' });
    const actual = ckScope(['octo-org/app_7x'], ticket);
    expect(
      actual.reason(),
      'A scope verification check did not return scope-violation reason on failure',
    ).toBe('scope-violation');
  });

  it('matches allowlist coordinates regardless of letter casing', () => {
    const ticket = {
      name: () => 'App_7X',
      owner: () => 'Octo-Org',
    };
    const actual = ckScope(['octo-org/app_7x'], ticket);
    expect(
      actual.valid(),
      'A scope verification check failed when coordinates differ only in letter casing',
    ).toBe(true);
  });

  it('fails when ticket coordinates throw TypeError', () => {
    const ticket = {
      name: () => {
        throw new TypeError('Cannot extract coordinates: ‡_bad');
      },
      owner: () => 'octo-org',
    };
    const actual = ckScope(['octo-org/app_7x'], ticket);
    expect(
      actual.message(),
      'A scope verification check did not fail with coordinates message on TypeError',
    ).toBe(
      'Scope violation: ticket repository coordinates cannot be determined',
    );
  });

  it('rethrows unexpected non-type errors thrown during coordinate evaluation', () => {
    const ticket = {
      name: () => {
        throw new RangeError('Index out of range: ‡_crash');
      },
      owner: () => 'octo-org',
    };
    const actual = ckScope(['octo-org/app_7x'], ticket);
    expect(
      () => actual.valid(),
      'A scope verification check did not rethrow unexpected non-type error',
    ).toThrow(RangeError);
  });

  it('defers coordinates check until queried', () => {
    let queried = false;
    const ticket = {
      name: () => {
        queried = true;
        return 'lazy-repo';
      },
      owner: () => 'octo-org',
    };
    ckScope(['octo-org/app_7x'], ticket);
    expect(
      queried,
      'A scope verification check evaluated coordinates eagerly upon instantiation',
    ).toBe(false);
  });
});
