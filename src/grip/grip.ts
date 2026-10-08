/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Defines a supplier endomorphism that governs how an encapsulated supplier
 * function is evaluated and retained.
 *
 * @typeParam T - The return type yielded by the supplier function.
 *
 * @param origin - The underlying supplier function to wrap.
 *
 * @returns A supplier function governed by the grip's evaluation discipline.
 */
export type Grip<T> = (origin: () => T) => () => T;
