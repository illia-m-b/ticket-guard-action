/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a composite {@link Check} that evaluates an array of checks
 * sequentially.
 *
 * Evaluation short-circuits at the first failing check. If all checks pass (or
 * if the input array is empty), a passed check is returned.
 *
 * @param checks - The ordered list of checks to evaluate.
 *
 * @returns The first failing {@link Check}, or {@link ckOk} if all checks pass.
 */
export const ckChained = (checks: readonly Check[]): Check =>
  ckEnvelope(() => checks.find((check) => !check.valid()) ?? ckOk());
