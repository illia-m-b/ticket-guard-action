/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a conditional {@link Check} that evaluates an underlying check only
 * when a prerequisite condition is met.
 *
 * If `shouldCheck` is `true`, validation delegates directly to the provided
 * `check`. If `shouldCheck` is `false`, validation succeeds immediately with
 * {@link ckOk}.
 *
 * @param shouldCheck - Whether the encapsulated check should be evaluated.
 * @param check - The {@link Check} to evaluate when `shouldCheck` is `true`.
 *
 * @returns A {@link Check} representing the conditional outcome.
 */
export const ckWhen = (shouldCheck: boolean, check: Check): Check =>
  ckEnvelope(() => (shouldCheck ? check : ckOk()));
