/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { Repository } from '#repository/repository.ts';

import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckScope } from '#check/ck-scope.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a scope verification check', () => {
  it('bypasses validation when scope is set to "any"', () => {
    const repository = rpPlain({ owner: 'pnpm', repo: 'setup' });
    const other = rpPlain({ owner: 'googleapis', repo: 'release-please' });
    const actual = ckScope('any', repository, other);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk('Validation bypassed: scope is set to "any"');
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };
    expect(
      check,
      'A scope verification check did not bypass validation when scope is "any"',
    ).toStrictEqual(passed);
  });

  it('bypasses validation when scope is set to "any" even if coordinates cannot be determined', () => {
    const repository = rpPlain({ owner: 'pnpm', repo: 'setup' });
    const ticket: Repository = {
      name: () => {
        throw new TypeError('Cannot extract coordinates');
      },
      owner: () => {
        throw new TypeError('Cannot extract coordinates');
      },
    };
    const actual = ckScope('any', repository, ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk('Validation bypassed: scope is set to "any"');
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };
    expect(
      check,
      'A scope verification check did not bypass validation when scope is "any" and coordinates cannot be determined',
    ).toStrictEqual(passed);
  });

  describe('"same-org" scope', () => {
    it('passes when repositories belong to the same organization', () => {
      const repository = rpPlain({ owner: 'pnpm', repo: 'setup' });
      const other = rpPlain({ owner: 'pnpm', repo: 'pnpm' });
      const actual = ckScope('same-org', repository, other);
      const check = {
        message: actual.message(),
        reason: actual.reason(),
        valid: actual.valid(),
      };
      const ok = ckOk();
      const passed = {
        message: ok.message(),
        reason: ok.reason(),
        valid: ok.valid(),
      };
      expect(
        check,
        'A scope verification check did not succeed when scope is "same-org" and repositories belong to the same organization',
      ).toStrictEqual(passed);
    });

    it('fails when repositories belong to different organizations', () => {
      const target = rpPlain({ owner: 'pnpm', repo: 'setup' });
      const ticket = rpPlain({ owner: 'googleapis', repo: 'release-please' });
      const actual = ckScope('same-org', target, ticket);
      const check = {
        message: actual.message(),
        reason: actual.reason(),
        valid: actual.valid(),
      };
      const expected = ckFailed(
        'scope-violation',
        `Scope violation: ticket owner "${ticket.owner()}" does not match target organization "${target.owner()}". Scope is set to "same-org".`,
      );
      const failed = {
        message: expected.message(),
        reason: expected.reason(),
        valid: expected.valid(),
      };
      expect(
        check,
        'A scope verification check succeeded when scope is "same-org" but repositories belong to different organizations',
      ).toStrictEqual(failed);
    });

    it('fails when ticket repository coordinates cannot be determined', () => {
      const target = rpPlain({ owner: 'pnpm', repo: 'setup' });
      const ticket: Repository = {
        name: () => {
          throw new TypeError('Cannot extract coordinates');
        },
        owner: () => {
          throw new TypeError('Cannot extract coordinates');
        },
      };
      const actual = ckScope('same-org', target, ticket);
      const check = {
        message: actual.message(),
        reason: actual.reason(),
        valid: actual.valid(),
      };
      const expected = ckFailed(
        'scope-violation',
        'Scope violation: ticket repository coordinates cannot be determined. Scope is set to "same-org".',
      );
      const failed = {
        message: expected.message(),
        reason: expected.reason(),
        valid: expected.valid(),
      };
      expect(
        check,
        'A scope verification check did not fail when ticket repository coordinates cannot be determined in "same-org" scope',
      ).toStrictEqual(failed);
    });
  });

  describe('"current-repo" scope', () => {
    it('passes when repositories are identical', () => {
      const repository = rpPlain({ owner: 'illia-m-b', repo: 'veils-js' });
      const clone = rpPlain({
        owner: repository.owner(),
        repo: repository.name(),
      });
      const actual = ckScope('current-repo', repository, clone);
      const check = {
        message: actual.message(),
        reason: actual.reason(),
        valid: actual.valid(),
      };
      const ok = ckOk();
      const passed = {
        message: ok.message(),
        reason: ok.reason(),
        valid: ok.valid(),
      };
      expect(
        check,
        'A scope verification check did not succeed when scope is "current-repo" and repositories are identical',
      ).toStrictEqual(passed);
    });

    it('fails when repositories belong to the same organization but have different names', () => {
      const owner = 'octocat';
      const one = 'octo-repo';
      const other = one.split('').toReversed().join('');
      const target = rpPlain({ owner, repo: one });
      const ticket = rpPlain({ owner, repo: other });
      const actual = ckScope('current-repo', target, ticket);
      const check = {
        message: actual.message(),
        reason: actual.reason(),
        valid: actual.valid(),
      };
      const expected = ckFailed(
        'scope-violation',
        `Scope violation: ticket belongs to "${ticket.owner()}/${ticket.name()}", but pull request targets "${target.owner()}/${target.name()}". Scope is set to "current-repo".`,
      );
      const failed = {
        message: expected.message(),
        reason: expected.reason(),
        valid: expected.valid(),
      };
      expect(
        check,
        'A scope verification check succeeded when scope is "current-repo", repositories belong to the same organization, but have different names',
      ).toStrictEqual(failed);
    });

    it('fails when ticket repository coordinates cannot be determined', () => {
      const target = rpPlain({ owner: 'octocat', repo: 'octo-repo' });
      const ticket: Repository = {
        name: () => {
          throw new TypeError('Cannot extract coordinates');
        },
        owner: () => {
          throw new TypeError('Cannot extract coordinates');
        },
      };
      const actual = ckScope('current-repo', target, ticket);
      const check = {
        message: actual.message(),
        reason: actual.reason(),
        valid: actual.valid(),
      };
      const expected = ckFailed(
        'scope-violation',
        'Scope violation: ticket repository coordinates cannot be determined. Scope is set to "current-repo".',
      );
      const failed = {
        message: expected.message(),
        reason: expected.reason(),
        valid: expected.valid(),
      };
      expect(
        check,
        'A scope verification check did not fail when ticket repository coordinates cannot be determined in "current-repo" scope',
      ).toStrictEqual(failed);
    });
  });
});
