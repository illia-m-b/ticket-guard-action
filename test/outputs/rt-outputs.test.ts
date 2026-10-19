/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { describe, it } from 'node:test';

import { rtOutputs } from '#outputs/rt-outputs.ts';

import { captured } from '../captured/captured.ts';
import { silenced } from '../silenced/silenced.ts';

void describe('A real-time GitHub Actions outputs adapter', () => {
  void it('emits workflow output parameter to environment file', () => {
    writeFileSync('node_modules/.test-gh-output.txt', '');
    process.env.GITHUB_OUTPUT = 'node_modules/.test-gh-output.txt';
    const value = `value-${randomInt(100, 9999)}`;
    rtOutputs().output('ticket-id', value);
    assert.ok(
      readFileSync('node_modules/.test-gh-output.txt', 'utf8').includes(value),
      'The action output parameter was not written to the runner output file',
    );
  });

  void it('marks process as failed on string message', () => {
    process.exitCode = 0;
    const code = silenced(() => {
      try {
        rtOutputs().fail(`fail-${randomInt(10, 100)}`);
        return process.exitCode;
      } finally {
        process.exitCode = 0;
      }
    });
    assert.equal(code, 1, 'The process exit code was not marked as failure');
  });

  void it('marks process as failed on error instance', () => {
    process.exitCode = 0;
    const code = silenced(() => {
      try {
        rtOutputs().fail(new Error(`fail-${randomInt(10, 100)}`));
        return process.exitCode;
      } finally {
        process.exitCode = 0;
      }
    });
    assert.equal(code, 1, 'The process exit code was not marked as failure');
  });

  void it('writes informational message to standard output', () => {
    const message = `info-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().info(message);
    });
    assert.equal(
      result,
      `${message}${EOL}`,
      'The informational message was not written to standard output',
    );
  });

  void it('writes debug annotation to standard output', () => {
    const message = `debug-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().debug(message);
    });
    assert.equal(
      result,
      `::debug::${message}${EOL}`,
      'The debug annotation was not written to standard output',
    );
  });

  void it('writes warning annotation from string to standard output', () => {
    const message = `warn-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().warn(message);
    });
    assert.equal(
      result,
      `::warning::${message}${EOL}`,
      'The warning annotation was not written to standard output',
    );
  });

  void it('writes warning annotation from error instance to standard output', () => {
    const message = `warn-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().warn(new Error(message));
    });
    assert.equal(
      result,
      `::warning::Error: ${message}${EOL}`,
      'The warning annotation was not written to standard output',
    );
  });

  void it('writes error annotation from string to standard output', () => {
    const message = `error-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().error(message);
    });
    assert.equal(
      result,
      `::error::${message}${EOL}`,
      'The error annotation was not written to standard output',
    );
  });

  void it('writes error annotation from error instance to standard output', () => {
    const message = `error-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().error(new Error(message));
    });
    assert.equal(
      result,
      `::error::Error: ${message}${EOL}`,
      'The error annotation was not written to standard output',
    );
  });

  void it('writes notice annotation from string to standard output', () => {
    const message = `notice-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().notice(message);
    });
    assert.equal(
      result,
      `::notice::${message}${EOL}`,
      'The notice annotation was not written to standard output',
    );
  });

  void it('writes notice annotation from error instance to standard output', () => {
    const message = `notice-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().notice(new Error(message));
    });
    assert.equal(
      result,
      `::notice::Error: ${message}${EOL}`,
      'The notice annotation was not written to standard output',
    );
  });
});
