/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a composite {@link Check} that evaluates an array of check suppliers
 * sequentially.
 *
 * Evaluation short-circuits at the first failing check, preventing invocation
 * of downstream suppliers. If all checks pass (or if the input array is empty),
 * a passed check is returned.
 *
 * @param checks - The ordered list of check suppliers to evaluate.
 *
 * @returns The first failing {@link Check}, or {@link ckOk} if all checks pass.
 */
export const ckChained = (checks: readonly (() => Check)[]): Check =>
  ckEnvelope(() => {
    for (const supplier of checks) {
      const check = supplier();
      if (!check.valid()) {
        return check;
      }
    }
    return ckOk();
  });
