/**
 * Copyright (c) 2018-present, Blue Marble Payroll, LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 import { IComponent } from "./component";

 let lastMessageId: number = 0;

 function nextMessageId(): number {
   return lastMessageId++;
 }

 function hasReceiveMap(component: IComponent, action: string) {
   return component.receive && component.receive[action];
 }

 function hasReceiveMessageFunction(component: IComponent) {
   return !!component.receiveMessage;
 }

 export interface IMessage {
   name: string;
   action: string;
   args: Record<string, any>;
 }

 export function emit(component: IComponent, message: IMessage): void {
  if (hasReceiveMap(component, message.action)) {
    // Use new messaging format
    component.receive[message.action](nextMessageId(), message.args);
  } else if (hasReceiveMessageFunction(component)) {
    // Use legacy messaging format
    component.receiveMessage(nextMessageId(), message.action, message.args);
  } else {
    throw new Error(`Cant message object: ${message.name} with action: ${message.action}`);
  }
}
