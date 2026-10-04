/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Inputs } from '#inputs/inputs.ts';

/**
 * Configuration options for creating a fake {@link Inputs} instance.
 */
export type FakeInputs = {
  readonly [K in keyof Inputs]: Inputs[K] extends (
    ..._arguments: never[]
  ) => unknown
    ? ReturnType<Inputs[K]>
    : never;
};

/**
 * Creates an in-memory {@link Inputs} instance for testing.
 *
 * @param initial - Optional partial values to override default test inputs.
 *
 * @returns A test {@link Inputs} implementation with predetermined values.
 */
export const fkInputs = ({
  allowedStatuses,
  extractFrom,
  failOnError,
  forbiddenLabels,
  gitHubToken,
  ignoreActors,
  requireAllLabels,
  requireAuthorAssigned,
  requiredLabels,
  scope,
}: Partial<FakeInputs> = {}): Inputs => ({
  allowedStatuses: () => allowedStatuses ?? ['open'],
  extractFrom: () => extractFrom ?? ['pr-title', 'pr-body'],
  failOnError: () => failOnError ?? true,
  forbiddenLabels: () => forbiddenLabels ?? [],
  gitHubToken: () => gitHubToken ?? '',
  ignoreActors: () => ignoreActors ?? ['dependabot[bot]', 'renovate[bot]'],
  requireAllLabels: () => requireAllLabels ?? false,
  requireAuthorAssigned: () => requireAuthorAssigned ?? false,
  requiredLabels: () => requiredLabels ?? [],
  scope: () => scope ?? 'current-repo',
});
