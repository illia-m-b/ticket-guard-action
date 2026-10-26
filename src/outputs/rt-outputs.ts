/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import {
  debug,
  error,
  info,
  notice,
  setFailed,
  setOutput,
  warning,
} from '@actions/core';

import type { Output, Outputs } from './outputs.ts';

/**
 * Creates an {@link Outputs} implementation that emits real-time workflow
 * outputs, diagnostic logs, and failure states to the GitHub Actions runner.
 *
 * Backed by `@actions/core`.
 *
 * @returns An {@link Outputs} instance connected to the runner runtime.
 */
export const rtOutputs = (): Outputs => ({
  debug: (message: string): void => {
    debug(message);
  },
  error: (message: Error | string): void => {
    error(message);
  },
  fail: (message: Error | string): void => {
    setFailed(message);
  },
  info: (message: string): void => {
    info(message);
  },
  notice: (message: Error | string): void => {
    notice(message);
  },
  output: (name: Output, value: string): void => {
    setOutput(name, value);
  },
  warn: (message: Error | string): void => {
    warning(message);
  },
});
