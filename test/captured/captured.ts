/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Executes a callback while intercepting standard output, returning the
 * captured output as a string and ensuring the stream is restored even if the
 * operation fails.
 *
 * @param action - The callback function to execute.
 *
 * @returns The captured standard output text.
 */
export const captured = (action: () => void): string => {
  const chunks: string[] = [];
  // eslint-disable-next-line unicorn/consistent-boolean-name
  const original = process.stdout.write.bind(process.stdout);
  process.stdout.write = (chunk: string | Uint8Array): boolean => {
    chunks.push(String(chunk));
    return true;
  };
  try {
    action();
    return chunks.join('');
  } finally {
    process.stdout.write = original;
  }
};
