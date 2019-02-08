/**
 * Copyright (c) 2018-present, Blue Marble Payroll, LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ReceiveMessageFunc = (messageId: number, args: Record<string, any>) => void;

export interface IComponent {
  receive?: Record<string, ReceiveMessageFunc>;
  receiveMessage?(messageId: number, action: string, args: Record<string, any>): void;
}
