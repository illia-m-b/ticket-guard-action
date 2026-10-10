/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Executes a callback while intercepting and discarding standard output,
 * ensuring process streams are restored even if the operation fails.
 *
 * @typeParam T - The return type produced by the executed action.
 *
 * @param action - The callback function to execute without writing to stdout.
 *
 * @returns The value returned by the callback.
 */
export const silenced = <T>(action: () => T): T => {
  const original = process.stdout.write.bind(process.stdout);
  process.stdout.write = () => true;
  try {
    return action();
  } finally {
    process.stdout.write = original;
  }
};
