/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { IssuePayload } from '#backlog/github/octokit.ts';

import { ghIssue } from '#backlog/github/gh-issue.ts';
import { rtGrip } from '#grip/rt-grip.ts';

describe('a GitHub issue adapter', () => {
  it('projects actual fields', () => {
    const payload: IssuePayload = {
      assignees: [{ login: 'pnpm' }, { login: 'googleapis' }],
      html_url: 'https://github.com/illia-m-b/veils-js/issues/56',
      labels: ['wontfix', { name: 'bug' }, {}],
      number: 56,
      state: 'open',
    };
    const expected = {
      assignees: ['pnpm', 'googleapis'],
      id: '56',
      labels: ['wontfix', 'bug'],
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/veils-js/issues/56',
    };
    const issue = ghIssue(payload);
    const actual = {
      assignees: issue.assignees(),
      id: issue.id(),
      labels: issue.labels(),
      present: issue.present(),
      status: issue.status(),
      url: issue.url(),
    };

    expect(
      actual,
      'Actual issue fields were not projected correctly',
    ).toStrictEqual(expected);
  });

  it('defaults assignees to an empty array when omitted', () => {
    const payload: IssuePayload = {
      html_url: 'https://github.com/illia-m-b/veils-js/issues/51',
      labels: ['wontfix'],
      number: 51,
      state: 'closed',
    };
    const issue = ghIssue(payload);
    const assignees = issue.assignees();
    const empty: readonly string[] = [];

    expect(
      assignees,
      'Assignees were not defaulted to an empty array when omitted from the payload',
    ).toStrictEqual(empty);
  });

  it('preserves labels reference identity across repeated calls', () => {
    const payload: IssuePayload = {
      html_url: 'https://github.com/illia-m-b/veils-js/issues/52',
      labels: ['bug', 'triage'],
      number: 52,
      state: 'open',
    };
    const issue = ghIssue(payload);
    const first = issue.labels();
    const second = issue.labels();

    expect(
      first,
      'Labels array reference changed between subsequent calls',
    ).toBe(second);
  });

  it('preserves assignees reference identity across repeated calls', () => {
    const payload: IssuePayload = {
      assignees: [{ login: 'developer' }],
      html_url: 'https://github.com/illia-m-b/veils-js/issues/53',
      labels: [],
      number: 53,
      state: 'open',
    };
    const issue = ghIssue(payload);
    const first = issue.assignees();
    const second = issue.assignees();

    expect(
      first,
      'Assignees array reference changed between subsequent calls',
    ).toBe(second);
  });

  it('reallocates array values when configured with real-time grip', () => {
    const payload: IssuePayload = {
      html_url: 'https://github.com/illia-m-b/veils-js/issues/54',
      labels: ['enhancement'],
      number: 54,
      state: 'open',
    };
    const issue = ghIssue(payload, rtGrip);
    const first = issue.labels();
    const second = issue.labels();

    expect(
      first,
      'Labels array reference remained identical under real-time grip',
    ).not.toBe(second);
  });
});
