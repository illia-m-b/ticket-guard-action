/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { describe, expect, it } from 'vitest';

import { rtOutputs } from '#outputs/rt-outputs.ts';

import { captured } from '../captured/captured.ts';
import { silenced } from '../silenced/silenced.ts';

describe('a real-time GitHub Actions outputs adapter', () => {
  it('emits workflow output parameter to environment file', () => {
    writeFileSync('node_modules/.test-gh-output.txt', '');
    process.env.GITHUB_OUTPUT = 'node_modules/.test-gh-output.txt';
    const value = `value-${randomInt(100, 9999)}`;
    rtOutputs().output('ticket-id', value);

    expect(
      readFileSync('node_modules/.test-gh-output.txt', 'utf8'),
      'The action output parameter was not written to the runner output file',
    ).toContain(value);
  });

  it('marks process as failed on string message', () => {
    process.exitCode = 0;
    const code = silenced(() => {
      try {
        rtOutputs().fail(`fail-${randomInt(10, 100)}`);
        return process.exitCode;
      } finally {
        process.exitCode = 0;
      }
    });

    expect(code, 'The process exit code was not marked as failure').toBe(1);
  });

  it('marks process as failed on error instance', () => {
    process.exitCode = 0;
    const code = silenced(() => {
      try {
        rtOutputs().fail(new Error(`fail-${randomInt(10, 100)}`));
        return process.exitCode;
      } finally {
        process.exitCode = 0;
      }
    });

    expect(code, 'The process exit code was not marked as failure').toBe(1);
  });

  it('writes informational message to standard output', () => {
    const message = `info-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().info(message);
    });

    expect(
      result,
      'The informational message was not written to standard output',
    ).toBe(`${message}${EOL}`);
  });

  it('writes debug annotation to standard output', () => {
    const message = `debug-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().debug(message);
    });

    expect(
      result,
      'The debug annotation was not written to standard output',
    ).toBe(`::debug::${message}${EOL}`);
  });

  it('writes warning annotation from string to standard output', () => {
    const message = `warn-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().warn(message);
    });

    expect(
      result,
      'The warning annotation was not written to standard output',
    ).toBe(`::warning::${message}${EOL}`);
  });

  it('writes warning annotation from error instance to standard output', () => {
    const message = `warn-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().warn(new Error(message));
    });

    expect(
      result,
      'The warning annotation was not written to standard output',
    ).toBe(`::warning::Error: ${message}${EOL}`);
  });

  it('writes error annotation from string to standard output', () => {
    const message = `error-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().error(message);
    });

    expect(
      result,
      'The error annotation was not written to standard output',
    ).toBe(`::error::${message}${EOL}`);
  });

  it('writes error annotation from error instance to standard output', () => {
    const message = `error-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().error(new Error(message));
    });

    expect(
      result,
      'The error annotation was not written to standard output',
    ).toBe(`::error::Error: ${message}${EOL}`);
  });

  it('writes notice annotation from string to standard output', () => {
    const message = `notice-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().notice(message);
    });

    expect(
      result,
      'The notice annotation was not written to standard output',
    ).toBe(`::notice::${message}${EOL}`);
  });

  it('writes notice annotation from error instance to standard output', () => {
    const message = `notice-${randomInt(10, 100)}`;
    const result = captured(() => {
      rtOutputs().notice(new Error(message));
    });

    expect(
      result,
      'The notice annotation was not written to standard output',
    ).toBe(`::notice::Error: ${message}${EOL}`);
  });
});
