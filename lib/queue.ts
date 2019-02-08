/**
 * Copyright (c) 2018-present, Blue Marble Payroll, LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export class Queue<T> {
  private map: Record<string, T[]>;

  constructor() {
    this.clearAll();
  }

  public push(key: string, member: T): void {
    if (!this.map[key]) {
      this.map[key] = [];
    }

    this.map[key].push(member);
  }

  public popAll(key: string): T[] {
    if (!this.map[key]) {
      return [];
    }

    const members = this.map[key];

    this.clear(key);

    return members;
  }

  public clearAll(): void {
    this.map = {};
  }

  public clear(key: string): void {
    this.map[key] = [];
  }
}
