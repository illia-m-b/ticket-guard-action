/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Action workflow inputs contract.
 *
 * Exposes typed accessors for all action configuration parameters.
 *
 * @see {@link https://github.com/illia-m-b/ticket-guard-action/blob/main/action.yml | action.yml} for
 *   canonical parameter descriptions and default values.
 */
export interface Inputs {
  readonly allowedStatuses: () => readonly string[];
  readonly extractFrom: () => Target;
  readonly failOnError: () => boolean;
  readonly forbiddenLabels: () => readonly string[];
  readonly gitHubToken: () => string;
  readonly ignoreActors: () => readonly string[];
  readonly requireAllLabels: () => boolean;
  readonly requireAuthorAssigned: () => boolean;
  readonly requiredLabels: () => readonly string[];
  readonly scope: () => Scope;
}

/**
 * Permissible repository scopes for referenced tickets.
 */
export const SCOPES = ['any', 'current-repo', 'same-org'] as const;

/**
 * Allowed repository scope type.
 */
export type Scope = (typeof SCOPES)[number];

/**
 * Permissible target locations to scan for ticket references.
 */
export const TARGETS = ['pr-body', 'pr-title', 'pr-title-or-body'] as const;

/**
 * Target scanning location type.
 */
export type Target = (typeof TARGETS)[number];
