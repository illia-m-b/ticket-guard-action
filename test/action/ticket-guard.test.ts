/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import type { Backlog } from '#backlog/backlog.ts';
import type { OutputsStorage } from '#outputs/fk-outputs.ts';
import type { Output } from '#outputs/outputs.ts';
import type { Reference } from '#reference/reference.ts';

import { ticketGuard } from '#action/ticket-guard.ts';
import { fkBacklog } from '#backlog/fk-backlog.ts';
import { fkTicket } from '#backlog/fk-ticket.ts';
import { fkInputs } from '#inputs/fk-inputs.ts';
import { fkOutputs } from '#outputs/fk-outputs.ts';
import { fkPullRequest } from '#pull-request/fk-pull-request.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('ticket guard GitHub action', () => {
  describe('successful verification', () => {
    it('publishes outputs and logs info when ticket passes verification', async () => {
      const id = String(randomInt(200, 20_000));
      const labels = ['approved', 'assigned', 'bug', 'question'];
      const status = 'open';
      const url = `https://github.com/octo-org/octo-repo/issues/${id}/`;
      const pr = fkPullRequest({ body: `Closes #${id}` });
      const inputs = fkInputs({
        extractFrom: ['pr-body'],
        requireAllLabels: true,
        requireAuthorAssigned: true,
        requiredLabels: ['assigned', 'approved'],
      });
      const ticket = fkTicket({
        assignees: ['octocat'],
        id,
        labels,
        present: true,
        status,
        url,
      });
      const backlog = fkBacklog([ticket]);
      const outputs = new Map<Output, string>();
      await ticketGuard(pr, inputs, backlog, fkOutputs({ outputs })).run();
      const result = Object.fromEntries(outputs);
      const passed: Record<Output, string> = {
        'error-message': '',
        'is-valid': 'true',
        'ticket-id': id,
        'ticket-labels': JSON.stringify(labels),
        'ticket-status': status,
        'ticket-url': url,
      };

      expect(
        result,
        'Ticket Guard action failed even though all requirements were met',
      ).toStrictEqual(passed);
    });

    it('logs informational message upon successful verification', async () => {
      const id = String(randomInt(200, 20_000));
      const status = 'open';
      const url = `https://github.com/octo-org/octo-repo/issues/${id}/`;
      const pr = fkPullRequest({ body: `Closes #${id}` });
      const inputs = fkInputs();
      const ticket = fkTicket({
        assignees: ['octocat'],
        id,
        present: true,
        status,
        url,
      });
      const backlog = fkBacklog([ticket]);
      const result: Partial<OutputsStorage> = {
        fails: [],
        infos: [],
        warns: [],
      };
      await ticketGuard(pr, inputs, backlog, fkOutputs(result)).run();
      const passed: Partial<OutputsStorage> = {
        fails: [],
        infos: ['Validation successful'],
        warns: [],
      };

      expect(
        result,
        'Ticket Guard action did not emit success message, or created failure/warning messages',
      ).toStrictEqual(passed);
    });

    it('publishes outputs and logs bypass message when author is ignored', async () => {
      const pr = fkPullRequest({ author: 'Renovate[BOT]' });
      const storage: Partial<OutputsStorage> = {
        infos: [],
        outputs: new Map(),
      };
      await ticketGuard(
        pr,
        fkInputs(),
        fkBacklog([]),
        fkOutputs(storage),
      ).run();
      const result = {
        infos: storage.infos,
        outputs: Object.fromEntries(storage.outputs ?? []),
      };
      const bypassed = {
        infos: [
          'Validation bypassed: author "Renovate[BOT]" is in ignore-actors',
        ],
        outputs: {
          'error-message': '',
          'is-valid': 'true',
        },
      };

      expect(
        result,
        'Ticket Guard action did not bypass and succeed when author is an ignored actor',
      ).toMatchObject(bypassed);
    });

    it('bypasses backlog queries when author is ignored', async () => {
      const pr = fkPullRequest({
        author: 'Renovate[BOT]',
        body: `Closes #${randomInt(100, 10_000)}`,
      });
      const backlog: Backlog = {
        ticket: () => {
          throw new Error('Unexpected backlog lookup');
        },
      };
      const outputs = new Map<Output, string>();
      await ticketGuard(
        pr,
        fkInputs({ extractFrom: ['pr-body'] }),
        backlog,
        fkOutputs({ outputs }),
      ).run();

      expect(
        outputs.get('is-valid'),
        'Ticket Guard action did not bypass backlog lookup for ignored author',
      ).toBe('true');
    });

    it('bypasses backlog queries when no issue reference is found', async () => {
      const pr = fkPullRequest({
        body: 'A regular pull request without issue reference',
      });
      const backlog: Backlog = {
        ticket: () => {
          throw new Error('Unexpected backlog lookup when reference is absent');
        },
      };
      const outputs = new Map<Output, string>();
      await ticketGuard(
        pr,
        fkInputs({ extractFrom: ['pr-body'] }),
        backlog,
        fkOutputs({ outputs }),
      ).run();

      expect(
        outputs.get('error-message'),
        'Ticket Guard action did not report no-ticket-found when reference is absent',
      ).toBe('no-ticket-found');
    });
  });

  describe('policy failures and failOnError modes', () => {
    it('fails the workflow step when validation fails and failOnError is enabled', async () => {
      const result: string[] = [];
      await ticketGuard(
        fkPullRequest(),
        fkInputs(),
        fkBacklog([]),
        fkOutputs({ fails: result }),
      ).run();
      const failed = ['No issue reference found in the pull request'];

      expect(
        result,
        'Ticket Guard action did not emit a failure message even though failOnError is enabled',
      ).toStrictEqual(failed);
    });

    it('emits a warning and does not fail the step when validation fails and failOnError is disabled', async () => {
      const result: string[] = [];
      await ticketGuard(
        fkPullRequest(),
        fkInputs({ failOnError: false }),
        fkBacklog([]),
        fkOutputs({ warns: result }),
      ).run();
      const warned = ['No issue reference found in the pull request'];

      expect(
        result,
        'Ticket Guard action did not emit a warning message even though failOnError is disabled',
      ).toStrictEqual(warned);
    });
  });

  describe('output state invariants on failure', () => {
    it('records "ticket-not-found" reason when referenced ticket is absent from backlog', async () => {
      const pr = fkPullRequest({
        author: 'anon',
        body: 'Fixes an issue',
        title: `fix(issue): fix an issue (#${randomInt(10_000, 20_000)})`,
      });
      const backlog = fkBacklog([fkTicket()]);
      const result = new Map<Output, string>();
      await ticketGuard(
        pr,
        fkInputs(),
        backlog,
        fkOutputs({ outputs: result }),
      ).run();
      const failed = {
        'error-message': 'ticket-not-found',
        'is-valid': 'false',
        'ticket-id': '',
        'ticket-labels': '[]',
        'ticket-status': '',
        'ticket-url': '',
      };

      expect(
        Object.fromEntries(result),
        'Ticket Guard action must fail with "ticket-not-found" reason when ticket is mentioned in PR but does not exist in backlog',
      ).toStrictEqual(failed);
    });

    it('records "scope-violation" reason when ticket belongs to another repository', async () => {
      const pr = fkPullRequest({
        body: 'Closes pnpm/setup#100',
        repository: rpPlain({
          owner: 'pnpm',
          repo: 'pnpm',
        }),
      });
      const backlog = fkBacklog([
        fkTicket({
          id: '100',
          present: true,
          url: 'https://github.com/pnpm/setup/issues#100',
        }),
      ]);
      const result = new Map<Output, string>();
      await ticketGuard(
        pr,
        fkInputs(),
        backlog,
        fkOutputs({ outputs: result }),
      ).run();
      const failed = 'scope-violation';

      expect(
        result.get('error-message'),
        'Ticket Guard action must fail with "scope-violation" reason when referenced ticket belongs to another repository',
      ).toBe(failed);
    });
  });

  describe('extraction configuration', () => {
    it('uses custom reference extractor when provided', async () => {
      const pr = fkPullRequest({
        body: 'Closes PROJ-123',
      });
      const backlog = fkBacklog([
        fkTicket({
          id: 'PROJ-123',
          present: true,
          status: 'open',
          url: 'https://my-company.atlassian.net/browse/PROJ-123',
        }),
      ]);
      const result = new Map<Output, string>();
      await ticketGuard(
        pr,
        fkInputs({ scope: 'any' }),
        backlog,
        fkOutputs({ outputs: result }),
        (text: string): Reference => {
          const match = /\b[A-Z]+-\d+\b/.exec(text);
          return match === null
            ? rfEmpty()
            : {
                id: () => match[0],
                present: () => true,
                raw: () => match[0],
              };
        },
      ).run();

      expect(
        result.get('ticket-id'),
        'Ticket Guard action must support custom reference extractors',
      ).toBe('PROJ-123');
    });
  });
});
