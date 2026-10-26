/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import type { OutputsStorage } from '#outputs/fk-outputs.ts';
import type { Output } from '#outputs/outputs.ts';

import { ticketGuard } from '#action/ticket-guard.ts';
import { fkBacklog } from '#backlog/fk-backlog.ts';
import { fkTicket } from '#backlog/fk-ticket.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckTraceability } from '#check/ck-traceability.ts';
import { trPlain } from '#check/tr-plain.ts';
import { fkInputs } from '#inputs/fk-inputs.ts';
import { fkOutputs } from '#outputs/fk-outputs.ts';
import { fkPullRequest } from '#pull-request/fk-pull-request.ts';

describe('ticket guard GitHub action', () => {
  it('defers traceability evaluation until action execution', () => {
    let isCalled = false;
    ticketGuard(
      async () => {
        isCalled = true;
        return trPlain(ckOk());
      },
      fkOutputs(),
      fkInputs(),
    );

    expect(
      isCalled,
      'The action evaluated the traceability check eagerly upon instantiation',
    ).toBe(false);
  });

  describe('successful verification', () => {
    it('publishes outputs and logs info when ticket passes verification', async () => {
      const id = String(randomInt(200, 20_000));
      const labels = ['approved', 'assigned', 'bug', 'question'];
      const status = 'open';
      const url = `https://github.com/octo-org/octo-repo/issues/${id}/`;
      const ticket = fkTicket({
        assignees: ['octocat'],
        id,
        labels,
        present: true,
        status,
        url,
      });
      const outputs = new Map<Output, string>();
      const storage: Partial<OutputsStorage> = {
        fails: [],
        infos: [],
        outputs,
        warns: [],
      };
      await ticketGuard(
        async () => trPlain(ckOk('All criteria met'), ticket),
        fkOutputs(storage),
        fkInputs(),
      ).run();
      const actual = {
        infos: storage.infos,
        outputs: Object.fromEntries(outputs),
      };
      const passed = {
        infos: ['All criteria met'],
        outputs: {
          'error-message': '',
          'is-valid': 'true',
          'ticket-id': id,
          'ticket-labels': JSON.stringify(labels),
          'ticket-status': status,
          'ticket-url': url,
        },
      };

      expect(
        actual,
        'Ticket Guard action did not publish expected outputs and info logs upon verification success',
      ).toStrictEqual(passed);
    });

    it('publishes empty ticket outputs when verification succeeds without ticket', async () => {
      const outputs = new Map<Output, string>();
      const storage: Partial<OutputsStorage> = {
        infos: [],
        outputs,
      };
      await ticketGuard(
        async () =>
          trPlain(ckOk('Validation bypassed: author is in ignore-actors')),
        fkOutputs(storage),
        fkInputs(),
      ).run();
      const actual = {
        infos: storage.infos,
        outputs: Object.fromEntries(outputs),
      };
      const bypassed = {
        infos: ['Validation bypassed: author is in ignore-actors'],
        outputs: {
          'error-message': '',
          'is-valid': 'true',
          'ticket-id': '',
          'ticket-labels': '[]',
          'ticket-status': '',
          'ticket-url': '',
        },
      };

      expect(
        actual,
        'Ticket Guard action did not publish empty ticket outputs when verification succeeded without ticket',
      ).toStrictEqual(bypassed);
    });
  });

  describe('policy failures and failOnError modes', () => {
    it('fails the workflow step when validation fails and failOnError is enabled', async () => {
      const fails: string[] = [];
      await ticketGuard(
        async () =>
          trPlain(
            ckFailed(
              'no-ticket-found',
              'No issue reference found in the pull request',
            ),
          ),
        fkOutputs({ fails }),
        fkInputs(),
      ).run();
      const failed = ['No issue reference found in the pull request'];

      expect(
        fails,
        'Ticket Guard action did not emit a failure message even though failOnError is enabled',
      ).toStrictEqual(failed);
    });

    it('emits a warning and does not fail the step when validation fails and failOnError is disabled', async () => {
      const warns: string[] = [];
      await ticketGuard(
        async () =>
          trPlain(
            ckFailed(
              'no-ticket-found',
              'No issue reference found in the pull request',
            ),
          ),
        fkOutputs({ warns }),
        fkInputs({ failOnError: false }),
      ).run();
      const warned = ['No issue reference found in the pull request'];

      expect(
        warns,
        'Ticket Guard action did not emit a warning message even though failOnError is disabled',
      ).toStrictEqual(warned);
    });

    it('publishes failure reason and invalid status on policy failure', async () => {
      const outputs = new Map<Output, string>();
      await ticketGuard(
        async () =>
          trPlain(
            ckFailed(
              'ticket-not-found',
              'Ticket not found. Check your backlog',
            ),
          ),
        fkOutputs({ outputs }),
        fkInputs(),
      ).run();
      const actual = Object.fromEntries(outputs);
      const failed = {
        'error-message': 'ticket-not-found',
        'is-valid': 'false',
        'ticket-id': '',
        'ticket-labels': '[]',
        'ticket-status': '',
        'ticket-url': '',
      };

      expect(
        actual,
        'Ticket Guard action did not record failure outputs properly when policy failed',
      ).toStrictEqual(failed);
    });
  });

  describe('end-to-end integration', () => {
    it('executes composite traceability check when wired together', async () => {
      const id = String(randomInt(100, 10_000));
      const inputs = fkInputs({ extractFrom: ['pr-body'] });
      const pr = fkPullRequest({ body: `Resolves #${id}` });
      const ticket = fkTicket({
        id,
        present: true,
        status: 'open',
        url: `https://github.com/octo-org/octo-repo/issues/${id}`,
      });
      const outputs = new Map<Output, string>();
      await ticketGuard(
        async () => ckTraceability(inputs, pr, fkBacklog([ticket])),
        fkOutputs({ outputs }),
        inputs,
      ).run();

      expect(
        outputs.get('ticket-id'),
        'The integrated ticket guard action failed to resolve the ticket identifier',
      ).toBe(id);
    });
  });
});
