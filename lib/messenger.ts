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

 function hasReceiveMap(constructedObject: IBrokerObject, action: string) {
   return constructedObject.receive && constructedObject.receive[action];
 }

 function hasReceiveMessageFunction(constructedObject: IBrokerObject) {
   return !!constructedObject.receiveMessage;
 }

 export interface IMessage {
   name: string;
   action: string;
   args: Record<string, any>;
 }

 export function emit(constructedObject: IBrokerObject, message: IMessage): void {
  if (hasReceiveMap(constructedObject, message.action)) {
    // Use new messaging format
    constructedObject.receive[message.action](nextMessageId(), message.args);
  } else if (hasReceiveMessageFunction(constructedObject)) {
    // Use legacy messaging format
    constructedObject.receiveMessage(nextMessageId(), message.action, message.args);
  } else {
    throw new Error(`Cant message object: ${message.name} with action: ${message.action}`);
  }
}
