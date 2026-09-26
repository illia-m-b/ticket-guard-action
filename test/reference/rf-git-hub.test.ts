/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { rfGitHub } from '#reference/rf-git-hub.ts';

describe('A GitHub issue reference', { concurrency: true }, () => {
  it('confirms presence when a valid issue reference is provided', () => {
    assert.equal(
      rfGitHub('fixes #42').present(),
      true,
      'A valid issue reference was unexpectedly marked as not present',
    );
  });

  describe('number extraction', { concurrency: true }, () => {
    for (const { expected, input, message, title } of [
      {
        expected: 143,
        input: 'fixes #143',
        message:
          'The extracted issue number does not match the shorthand numeric identifier',
        title: 'extracts number from shorthand reference',
      },
      {
        expected: 1023,
        input: 'see avajs/ava#1023',
        message:
          'The extracted issue number differs from the number specified in the scoped repository autolink',
        title: 'extracts number from scoped organization reference',
      },
      {
        expected: 21,
        input: 'ref foo-bar/unicorn.rainbow#21',
        message:
          'The issue number was parsed incorrectly when the repository name contained hyphens and dots',
        title: 'extracts number when repository contains hyphens and dots',
      },
      {
        expected: 409,
        input: 'fixes Meta/React#409',
        message:
          'The issue number was not extracted due to uppercase characters in the organization or repository name',
        title: 'extracts number when organization is capitalized',
      },
      {
        expected: 52_109,
        input: 'https://github.com/nodejs/node/issues/52109',
        message:
          'The issue number was not extracted from the canonical GitHub issue URL',
        title: 'extracts number from canonical https URL',
      },
      {
        expected: 1_000_000_000,
        input: '#1000000000',
        message:
          'The ten-digit boundary issue identifier was parsed incorrectly',
        title: 'extracts ten-digit issue number at upper boundary',
      },
      {
        expected: 891,
        input: 'fix: correct memory leak (#891) in worker',
        message:
          'The issue number enclosed in parentheses was not extracted from the commit message',
        title: 'extracts number embedded in commit message parentheses',
      },
      {
        expected: 666,
        input: 'resolves [#666] in core',
        message:
          'The issue number enclosed in square brackets was not extracted',
        title: 'extracts number enclosed in square brackets',
      },
      {
        expected: 77,
        input: 'First line of PR body\n\nCloses #77\n\nThanks!',
        message:
          'The issue reference located on a subsequent line of a multiline body was not detected',
        title: 'extracts number located on subsequent line of multiline body',
      },
      {
        expected: 42,
        input: 'Completed in #42.',
        message:
          'The issue number was not extracted when followed by a trailing period',
        title: 'extracts number when followed by trailing period',
      },
      {
        expected: 42,
        input: 'Addresses #42, please review',
        message:
          'The issue number was not extracted when followed by a trailing comma',
        title: 'extracts number when followed by trailing comma',
      },
      {
        expected: 42,
        input: 'Finally fixed #42!',
        message:
          'The issue number was not extracted when followed by an exclamation mark',
        title: 'extracts number when followed by exclamation mark',
      },
      {
        expected: 42,
        input: 'Did this resolve #42?',
        message:
          'The issue number was not extracted when followed by a question mark',
        title: 'extracts number when followed by question mark',
      },
      {
        expected: 42,
        input: 'Fixed in `#42` inside code block',
        message:
          'The issue number was not extracted when enclosed in markdown backticks',
        title: 'extracts number enclosed in markdown code backticks',
      },
      {
        expected: 42,
        input: 'See <#42> for details',
        message:
          'The issue number was not extracted when enclosed in angle brackets',
        title: 'extracts number enclosed in angle brackets',
      },
      {
        expected: 42,
        input: 'See <foo/bar#42> for details',
        message:
          'The scoped issue number was not extracted when enclosed in angle brackets',
        title: 'extracts scoped number enclosed in angle brackets',
      },
      {
        expected: 42,
        input: 'https://github.com/foo/bar/issues/42#issuecomment-123456789',
        message:
          'The issue number was not extracted from a URL containing a comment anchor fragment',
        title: 'extracts number from URL with comment anchor fragment',
      },
      {
        expected: 42,
        input: 'https://github.com/foo/bar/issues/42?tab=readme-ov-file',
        message:
          'The issue number was not extracted from a URL containing query parameters',
        title: 'extracts number from URL with query parameters',
      },
    ]) {
      it(title, () => {
        assert.equal(rfGitHub(input).number(), expected, message);
      });
    }
  });

  describe('raw string capture', { concurrency: true }, () => {
    for (const { expected, input, message, title } of [
      {
        expected: '#982',
        input: 'resolves #982',
        message:
          'The raw string does not match the exact shorthand issue token',
        title: 'captures raw shorthand token',
      },
      {
        expected: 'sindresorhus/dofle#33',
        input: 'closes sindresorhus/dofle#33',
        message:
          'The raw string does not preserve the full scoped repository autolink',
        title: 'captures raw scoped repository autolink',
      },
      {
        expected: 'https://github.com/eslint/eslint/issues/18900',
        input:
          'resolves https://github.com/eslint/eslint/issues/18900 in linter',
        message:
          'The raw string does not match the complete canonical issue URL',
        title: 'captures raw canonical URL',
      },
    ]) {
      it(title, () => {
        assert.equal(rfGitHub(input).raw(), expected, message);
      });
    }
  });

  describe('complex environments', { concurrency: true }, () => {
    it('selects the first ticket reference when multiple issues exist', () => {
      assert.equal(
        rfGitHub('fixes #12 and resolves #88').number(),
        12,
        'The first ticket reference was not selected when multiple issue references were present in text',
      );
    });

    it('processes a ten-thousand character hostile body within performance limits', () => {
      const hostile =
        'ab/cd-'.repeat(1600) + ' fixes #42 ' + '-cd/ab'.repeat(1600);
      assert.equal(
        rfGitHub(hostile).number(),
        42,
        'Failed to extract issue number from large hostile text within performance limits',
      );
    });
  });

  describe('syntax rejections', { concurrency: true }, () => {
    it('fails when requesting number from an unmentioned ticket', () => {
      assert.throws(
        () => rfGitHub('chore: update dependencies').number(),
        { message: 'Reference is empty', name: 'TypeError' },
        'Requesting number from an invalid reference did not throw the expected TypeError',
      );
    });

    it('returns empty raw string when ticket was not mentioned', () => {
      assert.equal(
        rfGitHub('chore: update dependencies').raw(),
        '',
        'An unmentioned ticket reference produced a non-empty raw string',
      );
    });

    for (const { input, message, title } of [
      {
        input: '#0',
        message:
          'Issue number zero was incorrectly treated as a valid issue reference',
        title: 'rejects issue number zero',
      },
      {
        input: '#',
        message:
          'A standalone hash character without digits was treated as an issue reference',
        title: 'rejects standalone hash symbol',
      },
      {
        input: '#bug',
        message:
          'A non-numeric hashtag was incorrectly treated as an issue reference',
        title: 'rejects hash followed by non-digits',
      },
      {
        input: '#123hashtag',
        message:
          'An alphanumeric hashtag was incorrectly treated as an issue reference',
        title: 'rejects hash followed by trailing alphanumeric word',
      },
      {
        input: 'color: #ffffff',
        message: 'A hexadecimal color code was mistaken for an issue reference',
        title: 'rejects six-digit hexadecimal color code',
      },
      {
        input: '### 42',
        message:
          'A markdown heading with space was mistaken for an issue reference',
        title: 'rejects markdown heading with space',
      },
      {
        input: '###42',
        message:
          'A markdown heading without space was mistaken for an issue reference',
        title: 'rejects markdown heading without space',
      },
      {
        input: 'foo#42',
        message:
          'An unscoped repository reference without a slash was treated as an issue reference',
        title: 'rejects unscoped word preceding hash without repository slash',
      },
      {
        input: 'email@#42',
        message:
          'An email address containing a hash was treated as an issue reference',
        title: 'rejects email address containing hash',
      },
      {
        input: '/issues/#42',
        message:
          'A URL path segment preceding a hash was treated as an issue reference',
        title: 'rejects path segment preceding hash',
      },
      {
        input: '#11111111111',
        message:
          'An issue number exceeding ten digits exceeded the allowable GitHub boundary',
        title: 'rejects numbers exceeding ten digits',
      },
      {
        input: '',
        message:
          'An empty text string unexpectedly produced a present issue reference',
        title: 'rejects empty input string',
      },
      {
        input: '   \n\t  ',
        message:
          'A whitespace-only string unexpectedly produced a present issue reference',
        title: 'rejects whitespace-only string',
      },
      {
        input: 'chore: clean up dependencies',
        message: 'Plain text without an issue reference was marked as present',
        title: 'rejects plain text containing no ticket',
      },
      {
        input: 'https://github.com/foo/bar/pull/42',
        message:
          'A Pull Request URL was mistakenly accepted as an issue reference',
        title: 'rejects pull request URL',
      },
    ]) {
      it(title, () => {
        assert.equal(rfGitHub(input).present(), false, message);
      });
    }
  });
});
