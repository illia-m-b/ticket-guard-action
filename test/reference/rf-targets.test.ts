/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { describe, it } from 'node:test';

import type { PullRequest } from '#pull-request/pull-request.ts';
import type { Reference } from '#reference/reference.ts';

import { fkPullRequest } from '#pull-request/fk-pull-request.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfTargets } from '#reference/rf-targets.ts';
import { rpPlain } from '#repository/rp-plain.ts';

void describe('A multi-target reference scanner', { concurrency: true }, () => {
  void it('extracts reference from pull request title when configured', () => {
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
    assert.deepStrictEqual(
      actual,
      expected,
      'The scanner failed to extract the expected reference from pull request title',
    );
  });

  void it('extracts reference from pull request body when configured', () => {
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
    assert.deepStrictEqual(
      actual,
      expected,
      'The scanner failed to extract the expected reference from pull request body',
    );
  });

  void it('falls back to body when title contains no reference', () => {
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
    assert.deepStrictEqual(
      actual,
      expected,
      'The scanner failed to resolve reference from fallback body target',
    );
  });

  void it('prioritizes title when title precedes body in target order', () => {
    const titleId = String(randomInt(100, 10_000));
    const bodyId = String(randomInt(100, 10_000));
    const pr = fkPullRequest({
      body: `Closes #${bodyId}`,
      title: `feat: support feature (#${titleId})`,
    });
    const reference = rfTargets(['pr-title', 'pr-body'], pr);
    assert.equal(
      reference.id(),
      titleId,
      'The scanner did not prioritize the title reference when title was ordered first',
    );
  });

  void it('prioritizes body when body precedes title in target order', () => {
    const titleId = String(randomInt(100, 10_000));
    const bodyId = String(randomInt(100, 10_000));
    const pr = fkPullRequest({
      body: `Closes #${bodyId}`,
      title: `feat: support feature (#${titleId})`,
    });
    const reference = rfTargets(['pr-body', 'pr-title'], pr);
    assert.equal(
      reference.id(),
      bodyId,
      'The scanner did not prioritize the body reference when body was ordered first',
    );
  });

  void it('yields empty reference representation when no target contains an issue reference', () => {
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
    assert.deepStrictEqual(
      actual,
      expected,
      'An unreferenced pull request did not yield an empty reference representation',
    );
  });

  void it('throws an error when accessing id on an unreferenced pull request', () => {
    const pr = fkPullRequest({
      body: 'No ticket mentioned in description',
      title: 'chore: internal refactoring without issue',
    });
    const reference = rfTargets(['pr-title', 'pr-body'], pr);
    assert.throws(
      () => reference.id(),
      { message: 'Reference is empty', name: 'TypeError' },
      'Accessing the id on an empty reference was unexpectedly permitted',
    );
  });

  void it('yields empty reference when target list is empty', () => {
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
    assert.deepStrictEqual(
      actual,
      expected,
      'A reference was unexpectedly found when no targets were configured to scan',
    );
  });

  void it('defers evaluation until reference methods are accessed', () => {
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
    assert.equal(
      accessed,
      never,
      'The pull request targets were eagerly accessed upon scanner creation',
    );
  });

  void it('avoids reading subsequent targets once an earlier target yields a reference', () => {
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
    assert.equal(
      accessed,
      never,
      'The pull request body was accessed even though the title already satisfied reference discovery',
    );
  });

  void it('uses custom extracted supplier when provided', () => {
    const id = `PROJ-${randomInt(100, 10_000)}`;
    const custom: Reference = {
      id: () => id,
      present: () => true,
      raw: () => id,
    };
    const extracted = (text: string): Reference =>
      text.includes('PROJ-') ? custom : rfEmpty();
    const pr = fkPullRequest({ title: `${id}: integration task` });
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
    assert.deepStrictEqual(
      actual,
      expected,
      'The custom extracted supplier did not return the expected reference values',
    );
  });
});
