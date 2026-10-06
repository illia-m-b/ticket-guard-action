/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

/**
 * Creates a check envelope that delegates the {@link Check} contract to an
 * encapsulated supplier function.
 *
 * @param origin - The supplier function yielding the underlying {@link Check}.
 *
 * @returns A {@link Check} forwarding all method calls to the supplied check.
 */
export const ckEnvelope = (origin: () => Check): Check => ({
  message: () => origin().message(),
  reason: () => origin().reason(),
  valid: () => origin().valid(),
});
