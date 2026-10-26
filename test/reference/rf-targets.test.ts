/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import type { PullRequest } from '#pull-request/pull-request.ts';
import type { Reference } from '#reference/reference.ts';

import { fkPullRequest } from '#pull-request/fk-pull-request.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfTargets } from '#reference/rf-targets.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a multi-target reference scanner', () => {
  it('extracts reference from pull request title when configured', () => {
    const id = String(randomInt(100, 10_000));
    const token = `#${id}`;
    const pr = fkPullRequest({
      title: `feat: add user authentication (${token})`,
    });
    const reference = rfTargets(['pr-title'], pr);
    const actual = {
      id: reference.id(),
      present: reference.present(),
      raw: reference.raw(),
    };
    const expected = {
      id,
      present: true,
      raw: token,
    };
    expect(
      actual,
      'The scanner failed to extract the expected reference from pull request title',
    ).toStrictEqual(expected);
  });

  it('extracts reference from pull request body when configured', () => {
    const id = String(randomInt(100, 10_000));
    const token = `#${id}`;
    const pr = fkPullRequest({
      body: `Resolves ${token} with database migration`,
    });
    const reference = rfTargets(['pr-body'], pr);
    const actual = {
      id: reference.id(),
      present: reference.present(),
      raw: reference.raw(),
    };
    const expected = {
      id,
      present: true,
      raw: token,
    };
    expect(
      actual,
      'The scanner failed to extract the expected reference from pull request body',
    ).toStrictEqual(expected);
  });

  it('falls back to body when title contains no reference', () => {
    const id = String(randomInt(100, 10_000));
    const token = `#${id}`;
    const pr = fkPullRequest({
      body: `Closes ${token}`,
      title: 'chore: minor documentation update',
    });
    const reference = rfTargets(['pr-title', 'pr-body'], pr);
    const actual = {
      id: reference.id(),
      present: reference.present(),
      raw: reference.raw(),
    };
    const expected = {
      id,
      present: true,
      raw: token,
    };
    expect(
      actual,
      'The scanner failed to resolve reference from fallback body target',
    ).toStrictEqual(expected);
  });

  it('prioritizes title when title precedes body in target order', () => {
    const titleId = String(randomInt(100, 10_000));
    const bodyId = String(randomInt(100, 10_000));
    const pr = fkPullRequest({
      body: `Closes #${bodyId}`,
      title: `feat: support feature (#${titleId})`,
    });
    const reference = rfTargets(['pr-title', 'pr-body'], pr);
    expect(
      reference.id(),
      'The scanner did not prioritize the title reference when title was ordered first',
    ).toBe(titleId);
  });

  it('prioritizes body when body precedes title in target order', () => {
    const titleId = String(randomInt(100, 10_000));
    const bodyId = String(randomInt(100, 10_000));
    const pr = fkPullRequest({
      body: `Closes #${bodyId}`,
      title: `feat: support feature (#${titleId})`,
    });
    const reference = rfTargets(['pr-body', 'pr-title'], pr);
    expect(
      reference.id(),
      'The scanner did not prioritize the body reference when body was ordered first',
    ).toBe(bodyId);
  });

  it('yields empty reference representation when no target contains an issue reference', () => {
    const pr = fkPullRequest({
      body: 'No ticket mentioned in description',
      title: 'chore: internal refactoring without issue',
    });
    const reference = rfTargets(['pr-title', 'pr-body'], pr);
    const actual = {
      present: reference.present(),
      raw: reference.raw(),
    };
    const expected = {
      present: false,
      raw: '',
    };
    expect(
      actual,
      'An unreferenced pull request did not yield an empty reference representation',
    ).toStrictEqual(expected);
  });

  it('throws an error when accessing id on an unreferenced pull request', () => {
    const pr = fkPullRequest({
      body: 'No ticket mentioned in description',
      title: 'chore: internal refactoring without issue',
    });
    const reference = rfTargets(['pr-title', 'pr-body'], pr);
    expect(
      () => reference.id(),
      'Accessing the id on an empty reference was unexpectedly permitted',
    ).toThrow(new TypeError('Reference is empty'));
  });

  it('yields empty reference when target list is empty', () => {
    const id = String(randomInt(100, 10_000));
    const pr = fkPullRequest({
      body: `Fixes #${id}`,
      title: 'feat: add feature',
    });
    const reference = rfTargets([], pr);
    const actual = {
      present: reference.present(),
      raw: reference.raw(),
    };
    const expected = {
      present: false,
      raw: '',
    };
    expect(
      actual,
      'A reference was unexpectedly found when no targets were configured to scan',
    ).toStrictEqual(expected);
  });

  it('defers evaluation until reference methods are accessed', () => {
    let accessed = 0;
    const never = 0;
    const pr: PullRequest = {
      author: () => 'octocat',
      body: () => {
        accessed += 1;
        return '';
      },
      repository: () => rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
      title: () => {
        accessed += 1;
        return '';
      },
    };
    rfTargets(['pr-title', 'pr-body'], pr);
    expect(
      accessed,
      'The pull request targets were eagerly accessed upon scanner creation',
    ).toBe(never);
  });

  it('avoids reading subsequent targets once an earlier target yields a reference', () => {
    let accessed = 0;
    const never = 0;
    const id = String(randomInt(100, 10_000));
    const pr: PullRequest = {
      author: () => 'octocat',
      body: () => {
        accessed += 1;
        return 'Fixes #999';
      },
      repository: () => rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
      title: () => `feat: implement capability (#${id})`,
    };
    const reference = rfTargets(['pr-title', 'pr-body'], pr);
    reference.present();
    expect(
      accessed,
      'The pull request body was accessed even though the title already satisfied reference discovery',
    ).toBe(never);
  });

  it('uses custom extracted supplier when provided', () => {
    const id = `PROJ-${randomInt(100, 10_000)}`;
    const pr = fkPullRequest({ title: `${id}: integration task` });
    const custom: Reference = {
      id: () => id,
      present: () => true,
      raw: () => id,
    };
    const extracted = (text: string): Reference =>
      text.includes('PROJ-') ? custom : rfEmpty();
    const reference = rfTargets(['pr-title'], pr, extracted);
    const actual = {
      id: reference.id(),
      present: reference.present(),
      raw: reference.raw(),
    };
    const expected = {
      id,
      present: true,
      raw: id,
    };
    expect(
      actual,
      'The custom extracted supplier did not return the expected reference values',
    ).toStrictEqual(expected);
  });
});
