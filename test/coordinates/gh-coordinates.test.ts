/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ghCoordinates } from '#coordinates/gh-coordinates.ts';

describe('a GitHub repository coordinate', () => {
  describe('normalization', () => {
    it.for([
      {
        expected: 'octo-org/octo-repo',
        input: 'octo-org/octo-repo',
        message:
          'The repository coordinates were not preserved for canonical format',
        title: 'accepts canonical coordinates',
      },
      {
        expected: 'octo-org/my-repo',
        input: 'Octo-Org/My-Repo',
        message: 'The repository coordinates were not lowercased',
        title: 'normalizes uppercase coordinates to lowercase',
      },
      {
        expected: 'a/b',
        input: 'a/b',
        message:
          'The repository coordinates were not accepted for single-character names',
        title: 'accepts single character owner and repository names',
      },
      {
        expected: 'org/.github',
        input: 'org/.github',
        message:
          'The repository coordinates were not accepted for dot-prefixed repository',
        title: 'accepts repository name starting with dot',
      },
      {
        expected: 'org/repo_name',
        input: 'org/repo_name',
        message:
          'The repository coordinates were not accepted for underscored repository',
        title: 'accepts repository name containing underscore',
      },
      {
        expected: 'org/repo',
        input: '  org/repo  ',
        message:
          'The repository coordinates did not trim surrounding whitespace',
        title: 'trims surrounding whitespace from coordinates',
      },
    ])('$title', ({ expected, input, message }) => {
      const coordinates = ghCoordinates(input);
      expect(coordinates.normalized(), message).toBe(expected);
    });
  });

  describe('syntax rejections', () => {
    it.for([
      {
        input: 'octo-org/octo-repo.git',
        message: 'Coordinates ending in .git were mistakenly accepted',
        title: 'rejects repository name ending in .git',
      },
      {
        input: 'octo-org/octo-repo.GIT',
        message:
          'Coordinates ending in uppercase .GIT were mistakenly accepted',
        title: 'rejects repository name ending in uppercase .GIT',
      },
      {
        input: 'https://github.com/octo-org/octo-repo',
        message:
          'An HTTPS URL was mistakenly accepted as repository coordinates',
        title: 'rejects HTTPS URL',
      },
      {
        input: 'git@github.com:octo-org/octo-repo',
        message: 'An SSH URL was mistakenly accepted as repository coordinates',
        title: 'rejects SSH URL',
      },
      {
        input: 'octo-repo',
        message: 'Coordinates missing owner segment were mistakenly accepted',
        title: 'rejects coordinates without owner',
      },
      {
        input: 'octo-org/',
        message: 'Coordinates with trailing slash were mistakenly accepted',
        title: 'rejects coordinates missing repository name',
      },
      {
        input: '/octo-repo',
        message: 'Coordinates with leading slash were mistakenly accepted',
        title: 'rejects coordinates with leading slash',
      },
      {
        input: 'octo-org/repo/extra',
        message:
          'Coordinates with multiple path segments were mistakenly accepted',
        title: 'rejects coordinates with multiple path segments',
      },
      {
        input: 'octo-org//octo-repo',
        message: 'Coordinates with duplicate slashes were mistakenly accepted',
        title: 'rejects coordinates with duplicate slashes',
      },
      {
        input: '-octo/repo',
        message:
          'Coordinates with leading hyphen in owner were mistakenly accepted',
        title: 'rejects owner starting with hyphen',
      },
      {
        input: 'octo-/repo',
        message:
          'Coordinates with trailing hyphen in owner were mistakenly accepted',
        title: 'rejects owner ending with hyphen',
      },
      {
        input: 'octo--org/repo',
        message:
          'Coordinates with consecutive hyphens in owner were mistakenly accepted',
        title: 'rejects owner containing consecutive hyphens',
      },
      {
        input: 'octo_org/repo',
        message:
          'Coordinates with underscore in owner were mistakenly accepted',
        title: 'rejects owner containing underscore',
      },
      {
        input: 'org/.',
        message: 'A single dot repository name was mistakenly accepted',
        title: 'rejects single dot repository name',
      },
      {
        input: 'org/..',
        message: 'A double dot repository name was mistakenly accepted',
        title: 'rejects double dot repository name',
      },
      {
        input: 'org/repo name',
        message: 'Coordinates containing spaces were mistakenly accepted',
        title: 'rejects coordinates containing internal space',
      },
      {
        input: `${'a'.repeat(40)}/repo`,
        message:
          'Coordinates with owner exceeding thirty-nine characters were mistakenly accepted',
        title: 'rejects owner exceeding maximum length',
      },
      {
        input: `org/${'a'.repeat(101)}`,
        message:
          'Coordinates with repository exceeding one hundred characters were mistakenly accepted',
        title: 'rejects repository exceeding maximum length',
      },
      {
        input: '',
        message: 'An empty coordinate string was mistakenly accepted',
        title: 'rejects empty coordinate string',
      },
      {
        input: ' '.repeat(3),
        message: 'A whitespace-only coordinate string was mistakenly accepted',
        title: 'rejects whitespace coordinate string',
      },
    ])('$title', ({ input, message }) => {
      const coordinates = ghCoordinates(input);
      expect(() => coordinates.normalized(), message).toThrow(
        new TypeError(
          `Invalid repository coordinates: expected ("owner/repo"), got "${input.trim()}"`,
        ),
      );
    });
  });
});
