/**
 * Copyright (c) 2018-present, Blue Marble Payroll, LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export class Registry<T> {
  private map: Record<string, T>;

  constructor() {
    this.clear();
  }

  public add(key: string, member: T): void {
    this.map[key] = member;
  }

  public find(key: string): T {
    return this.map[key];
  }

  public clear(): void {
    this.map = {};
  }
}
