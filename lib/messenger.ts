/**
 * Copyright (c) 2018-present, Blue Marble Payroll, LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 import { IBrokerObject } from "./broker_object";

 let lastMessageId: number = 0;

 function nextMessageId(): number {
   return lastMessageId++;
 }

 export interface IMessage {
   name: string;
   action: string;
   args: Record<string, any>;
 }

 export function emit(constructedObject: IBrokerObject, message: IMessage): void {
  if (constructedObject.receive && constructedObject.receive[message.action]) {
    // Use new messaging format
    constructedObject.receive[message.action](nextMessageId(), message.args);
  } else if (constructedObject.receive && !constructedObject.receive[message.action]) {
    // Use new messaging format but cant find action function
    throw new Error(`Object: ${message.name} does not respond to: ${message.action}`);
  } else if (constructedObject.receiveMessage) {
    // Use legacy messaging format
    constructedObject.receiveMessage(nextMessageId(), message.action, message.args);
  } else {
    throw new Error(`Cannot figure out how to message object: ${message.name}`);
  }
}
