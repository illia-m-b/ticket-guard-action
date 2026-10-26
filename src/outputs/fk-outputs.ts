/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Output, Outputs } from './outputs.ts';

const stringified = (message: Error | string): string =>
  message instanceof Error ? message.message : message;

/**
 * In-memory storage buffers capturing outputs and diagnostic log messages
 * emitted by {@link fkOutputs}.
 */
export interface OutputsStorage {
  /**
   * Buffer collecting emitted debug messages.
   */
  readonly debugs: string[];

  /**
   * Buffer collecting emitted error messages.
   */
  readonly errors: string[];

  /**
   * Buffer collecting emitted step failure messages.
   */
  readonly fails: string[];

  /**
   * Buffer collecting emitted informational messages.
   */
  readonly infos: string[];

  /**
   * Buffer collecting emitted notice messages.
   */
  readonly notices: string[];

  /**
   * Map collecting assigned action output parameters.
   */
  readonly outputs: Map<Output, string>;

  /**
   * Buffer collecting emitted warning messages.
   */
  readonly warns: string[];
}

/**
 * Creates an in-memory {@link Outputs} instance for testing.
 *
 * @param storage - Optional custom storage buffers to capture emitted outputs
 *   and diagnostic messages. Defaults to new empty buffers.
 *
 * @returns A test {@link Outputs} instance.
 */
export const fkOutputs = ({
  debugs = [],
  errors = [],
  fails = [],
  infos = [],
  notices = [],
  outputs = new Map(),
  warns = [],
}: Partial<OutputsStorage> = {}): Outputs => ({
  debug: (message: string): void => {
    debugs.push(message);
  },
  error: (message: Error | string): void => {
    errors.push(stringified(message));
  },
  fail: (message: Error | string): void => {
    fails.push(stringified(message));
  },
  info: (message: string): void => {
    infos.push(message);
  },
  notice: (message: Error | string): void => {
    notices.push(stringified(message));
  },
  output: (name: Output, value: string): void => {
    outputs.set(name, value);
  },
  warn: (message: Error | string): void => {
    warns.push(stringified(message));
  },
});
