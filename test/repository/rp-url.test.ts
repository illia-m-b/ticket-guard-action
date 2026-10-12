/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { rpUrl } from '#repository/rp-url.ts';

describe('A repository URL', { concurrency: true }, () => {
  it('defers evaluation until coordinates are accessed', () => {
    assert.doesNotThrow(
      () => rpUrl('invalid input'),
      'Constructing repository coordinates from an invalid input threw eagerly',
    );
  });

  describe('coordinates extraction', { concurrency: true }, () => {
    for (const { expected, input, message, title } of [
      {
        expected: { name: 'node', owner: 'nodejs' },
        input: 'https://github.com/nodejs/node/issues/52109',
        message:
          'The repository coordinates were not extracted from the canonical GitHub issue URL',
        title: 'extracts coordinates from canonical issue URL',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'https://github.com/foo/bar/issues/42#issuecomment-123456789',
        message:
          'The repository coordinates were not extracted from a URL containing a comment anchor fragment',
        title: 'extracts coordinates from URL with comment anchor fragment',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'https://github.com/foo/bar/issues/42?tab=readme-ov-file',
        message:
          'The repository coordinates were not extracted from a URL containing query parameters',
        title: 'extracts coordinates from URL with query parameters',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'https://github.com/foo/bar/pull/42',
        message:
          'The repository coordinates were not extracted from a Pull Request URL',
        title: 'extracts coordinates from pull request URL',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: 'https://github.com/eslint/eslint',
        message:
          'The repository coordinates were not extracted from the canonical repository root URL',
        title: 'extracts coordinates from canonical repository root URL',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: 'https://github.com/eslint/eslint/',
        message:
          'The repository coordinates were not extracted when followed by a trailing slash',
        title: 'extracts coordinates from repository URL with trailing slash',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: 'https://github.com/eslint/eslint.git',
        message:
          'The repository coordinates did not strip the .git suffix from https URL',
        title: 'extracts coordinates from https URL with .git extension',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: 'git@github.com:eslint/eslint.git',
        message:
          'The repository coordinates were not extracted from a git SSH clone URL with .git suffix',
        title: 'extracts coordinates from git SSH URL with .git extension',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: 'git@github.com:eslint/eslint',
        message:
          'The repository coordinates were not extracted from a git SSH clone URL without .git suffix',
        title: 'extracts coordinates from git SSH URL without .git extension',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: 'ssh://git@github.com/eslint/eslint.git',
        message:
          'The repository coordinates were not extracted from an ssh protocol URL',
        title: 'extracts coordinates from ssh protocol URL',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: 'git://github.com/eslint/eslint.git',
        message:
          'The repository coordinates were not extracted from a git protocol URL',
        title: 'extracts coordinates from git protocol URL',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        // eslint-disable-next-line sonarjs/no-clear-text-protocols, unicorn/prefer-https
        input: 'http://github.com/eslint/eslint',
        message:
          'The repository coordinates were not extracted from an insecure http URL',
        title: 'extracts coordinates from insecure http URL',
      },
      {
        expected: { name: 'dofle', owner: 'sindresorhus' },
        input: 'sindresorhus/dofle#33',
        message:
          'The repository coordinates were not extracted from a scoped repository autolink',
        title: 'extracts coordinates from scoped repository autolink',
      },
      {
        expected: { name: 'ava', owner: 'avajs' },
        input: 'avajs/ava#1023',
        message:
          'The repository coordinates were not extracted from an organization autolink',
        title: 'extracts coordinates from scoped organization autolink',
      },
      {
        expected: { name: 'unicorn.rainbow', owner: 'foo-bar' },
        input: 'foo-bar/unicorn.rainbow#21',
        message:
          'The repository coordinates were parsed incorrectly when the repository name contained hyphens and dots',
        title: 'extracts coordinates when repository contains hyphens and dots',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'foo/bar',
        message:
          'The repository coordinates were not extracted from a plain repository slug',
        title: 'extracts coordinates from plain repository slug',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'foo/bar.git',
        message:
          'The repository coordinates did not strip the .git suffix from a plain repository slug',
        title:
          'extracts coordinates from plain repository slug with .git extension',
      },
      {
        expected: { name: 'repo', owner: 'org' },
        input: 'https://github.com/org/repo/blob/main/src/utils#42',
        message:
          'The repository coordinates were not extracted from a GitHub blob URL with line anchor',
        title: 'extracts coordinates from GitHub blob URL with line anchor',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: '<https://github.com/eslint/eslint>',
        message:
          'The repository coordinates were not extracted when enclosed in angle brackets',
        title: 'extracts coordinates enclosed in angle brackets',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: '<foo/bar#42>',
        message:
          'The scoped repository coordinates were not extracted when enclosed in angle brackets',
        title: 'extracts scoped coordinates enclosed in angle brackets',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: '(https://github.com/foo/bar)',
        message:
          'The repository coordinates were not extracted when enclosed in parentheses',
        title: 'extracts coordinates enclosed in parentheses',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: '(foo/bar)',
        message:
          'The scoped repository coordinates were not extracted when enclosed in parentheses',
        title: 'extracts scoped coordinates enclosed in parentheses',
      },
      {
        expected: { name: 'dofle', owner: 'sindresorhus' },
        input: '[sindresorhus/dofle#33]',
        message:
          'The repository coordinates were not extracted when enclosed in square brackets',
        title: 'extracts coordinates enclosed in square brackets',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: '"https://github.com/foo/bar"',
        message:
          'The repository coordinates were not extracted when enclosed in double quotes',
        title: 'extracts coordinates enclosed in double quotes',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: "'https://github.com/foo/bar'",
        message:
          'The repository coordinates were not extracted when enclosed in single quotes',
        title: 'extracts coordinates enclosed in single quotes',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: '`https://github.com/foo/bar`',
        message:
          'The repository coordinates were not extracted when enclosed in markdown backticks',
        title: 'extracts coordinates enclosed in markdown backticks',
      },
      {
        expected: { name: 'eslint', owner: 'eslint' },
        input: '  https://github.com/eslint/eslint  ',
        message:
          'The repository coordinates were not extracted when surrounded by whitespace',
        title: 'extracts coordinates surrounded by whitespace',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'https://github.com/foo/bar.',
        message:
          'The repository coordinates were not extracted when followed by a trailing period',
        title: 'extracts coordinates when followed by trailing period',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'foo/bar#42.',
        message:
          'The scoped coordinates were not extracted when followed by a trailing period',
        title: 'extracts scoped coordinates when followed by trailing period',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'https://github.com/foo/bar,',
        message:
          'The repository coordinates were not extracted when followed by a trailing comma',
        title: 'extracts coordinates when followed by trailing comma',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'foo/bar#42,',
        message:
          'The scoped coordinates were not extracted when followed by a trailing comma',
        title: 'extracts scoped coordinates when followed by trailing comma',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'https://github.com/foo/bar!',
        message:
          'The repository coordinates were not extracted when followed by an exclamation mark',
        title: 'extracts coordinates when followed by exclamation mark',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'foo/bar#42!',
        message:
          'The scoped coordinates were not extracted when followed by an exclamation mark',
        title: 'extracts scoped coordinates when followed by exclamation mark',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'https://github.com/foo/bar?',
        message:
          'The repository coordinates were not extracted when followed by a question mark',
        title: 'extracts coordinates when followed by question mark',
      },
      {
        expected: { name: 'bar', owner: 'foo' },
        input: 'foo/bar#42?',
        message:
          'The scoped coordinates were not extracted when followed by a question mark',
        title: 'extracts scoped coordinates when followed by question mark',
      },
    ]) {
      it(title, () => {
        const repository = rpUrl(input);
        assert.deepStrictEqual(
          { name: repository.name(), owner: repository.owner() },
          expected,
          message,
        );
      });
    }
  });

  describe('case normalization', { concurrency: true }, () => {
    for (const { expected, input, message, title } of [
      {
        expected: { name: 'react', owner: 'meta' },
        input: 'fixes Meta/React#409',
        message:
          'The extracted coordinates were not lowercased for scoped reference',
        title: 'normalizes scoped reference to lowercase',
      },
      {
        expected: { name: 'node', owner: 'nodejs' },
        input: 'https://github.com/NodeJS/Node',
        message:
          'The extracted coordinates were not lowercased for canonical URL',
        title: 'normalizes canonical URL coordinates to lowercase',
      },
    ]) {
      it(title, () => {
        const repository = rpUrl(input);
        assert.deepStrictEqual(
          { name: repository.name(), owner: repository.owner() },
          expected,
          message,
        );
      });
    }
  });

  describe('complex environments', { concurrency: true }, () => {
    it('selects the first repository reference when multiple repositories exist', () => {
      const repository = rpUrl(
        'fixes https://github.com/nodejs/node/issues/52109 and resolves https://github.com/eslint/eslint/issues/18900',
      );
      assert.deepStrictEqual(
        { name: repository.name(), owner: repository.owner() },
        { name: 'node', owner: 'nodejs' },
        'The first repository reference was not selected when multiple repository URLs were present in text',
      );
    });

    it('processes a ten-thousand character hostile body within performance limits', () => {
      const hostile =
        'ab-cd-'.repeat(1600) +
        ' https://github.com/nodejs/node/issues/52109 ' +
        '-cd-ab'.repeat(1600);
      const repository = rpUrl(hostile);
      assert.deepStrictEqual(
        { name: repository.name(), owner: repository.owner() },
        { name: 'node', owner: 'nodejs' },
        'Failed to extract repository coordinates from large hostile text within performance limits',
      );
    });
  });

  describe('syntax rejections', { concurrency: true }, () => {
    for (const { input, message, title } of [
      {
        input: '#42',
        message:
          'A shorthand issue identifier without repository was mistakenly parsed',
        title: 'rejects shorthand ticket reference',
      },
      {
        input: '#0',
        message: 'Issue id zero was mistakenly treated as a repository URL',
        title: 'rejects issue id zero',
      },
      {
        input: '#',
        message: 'A standalone hash character was treated as a repository URL',
        title: 'rejects standalone hash symbol',
      },
      {
        input: '#bug',
        message: 'A non-numeric hashtag was treated as a repository URL',
        title: 'rejects hash followed by non-digits',
      },
      {
        input: '#123hashtag',
        message:
          'An alphanumeric hashtag was mistakenly treated as a repository URL',
        title: 'rejects hash followed by trailing alphanumeric word',
      },
      {
        input: 'color: #ffffff',
        message: 'A hexadecimal color code was mistaken for a repository URL',
        title: 'rejects six-digit hexadecimal color code',
      },
      {
        input: '### 42',
        message:
          'A markdown heading with space was mistaken for a repository URL',
        title: 'rejects markdown heading with space',
      },
      {
        input: '###42',
        message:
          'A markdown heading without space was mistaken for a repository URL',
        title: 'rejects markdown heading without space',
      },
      {
        input: 'foo#42',
        message:
          'An unscoped reference without repository slash was treated as a repository URL',
        title: 'rejects unscoped word preceding hash without repository slash',
      },
      {
        input: 'email@#42',
        message:
          'An email address containing a hash was treated as a repository URL',
        title: 'rejects email address containing hash',
      },
      {
        input: '/issues/#42',
        message:
          'A URL path segment preceding a hash was treated as a repository URL',
        title: 'rejects path segment preceding hash',
      },
      {
        input: '',
        message:
          'An empty input string unexpectedly produced repository coordinates',
        title: 'rejects empty input string',
      },
      {
        input: '   \n\t  ',
        message:
          'A whitespace-only string unexpectedly produced repository coordinates',
        title: 'rejects whitespace-only string',
      },
      {
        input: 'chore: clean up dependencies',
        message:
          'Plain text without coordinates unexpectedly produced a repository',
        title: 'rejects plain text containing no repository',
      },
      {
        input: 'https://gitlab.com/group/project#42',
        message:
          'An anchor fragment on an external repository URL was mistakenly accepted',
        title: 'rejects anchor fragments on external URLs',
      },
      {
        input: 'https://gitlab.com/group/project',
        message:
          'An external GitLab repository URL was mistakenly accepted as a GitHub repository',
        title: 'rejects external GitLab repository URL',
      },
      {
        input: 'git@gitlab.com:group/project.git',
        message:
          'An external GitLab SSH clone URL was mistakenly accepted as a GitHub repository',
        title: 'rejects external GitLab SSH clone URL',
      },
      {
        input: 'https://bitbucket.org/group/project',
        message:
          'An external Bitbucket repository URL was mistakenly accepted as a GitHub repository',
        title: 'rejects external Bitbucket repository URL',
      },
      {
        input: 'https://github.com.evil.com/foo/bar',
        message:
          'A spoofed GitHub domain URL was mistakenly accepted as a GitHub repository',
        title: 'rejects spoofed GitHub domain',
      },
      {
        input: 'https://evil-github.com/foo/bar',
        message:
          'A spoofed GitHub domain prefix URL was mistakenly accepted as a GitHub repository',
        title: 'rejects spoofed GitHub domain prefix',
      },
      {
        input: 'https://github.com/owner',
        message:
          'A GitHub URL without a repository name segment was mistakenly accepted',
        title: 'rejects GitHub URL missing repository segment',
      },
      {
        input: 'https://github.com/owner/',
        message:
          'A GitHub URL with an empty repository segment was mistakenly accepted',
        title:
          'rejects GitHub URL missing repository segment with trailing slash',
      },
      {
        input: 'https://github.com//repo',
        message:
          'A GitHub URL with an empty owner segment was mistakenly accepted',
        title: 'rejects GitHub URL with empty owner segment',
      },
      {
        input: '../..',
        message: 'A directory traversal string was mistakenly accepted',
        title: 'rejects relative directory traversal string',
      },
      {
        input: './bar',
        message:
          'A relative dot path was mistakenly accepted as repository coordinates',
        title: 'rejects relative dot slash path',
      },
      {
        input: '../bar',
        message:
          'A parent directory path was mistakenly accepted as repository coordinates',
        title: 'rejects parent directory traversal path',
      },
      {
        input: 'foo/.',
        message:
          'A path ending in a dot segment was mistakenly accepted as repository coordinates',
        title: 'rejects repository name ending in dot',
      },
      {
        input: 'foo/..',
        message:
          'A path ending in double dots was mistakenly accepted as repository coordinates',
        title: 'rejects repository name ending in double dots',
      },
    ]) {
      it(title, () => {
        assert.throws(
          () => rpUrl(input).owner(),
          {
            message: `Cannot extract repository coordinates from URL: "${input}"`,
            name: 'TypeError',
          },
          message,
        );
      });
    }
  });
});
