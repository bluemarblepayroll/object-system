/**
 * Copyright (c) 2018-present, Blue Marble Payroll, LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IBrokerObject } from "./broker_object";
import { emit, IMessage } from "./messenger";

export type Constructor = (name: string, config: Record<string, any>, arg: any) => IBrokerObject;

interface IQueuedMake {
  type: string;
  name: string;
  config: Record<string, any>;
  arg: any;
  overwrite: boolean;
}

let queuedMakes: Record<string, IQueuedMake[]> = {};
let madeObjects: Record<string, IBrokerObject> = {};
let constructors: Record<string, Constructor> = {};
let queuedMessages: Record<string, IMessage[]> = {};

function getConstructor(type: string) {
  return constructors[type];
}

function getObject(name: string): IBrokerObject {
  return madeObjects[name];
}

function queueMakeCall(makeCall: IQueuedMake): void {
  if (!queuedMakes[makeCall.type]) {
    queuedMakes[makeCall.type] = [];
  }

  queuedMakes[makeCall.type].push(makeCall);
}

function queueMessage(queuedMessage: IMessage): void {
  if (!queuedMessages[queuedMessage.name]) {
    queuedMessages[queuedMessage.name] = [];
  }

  queuedMessages[queuedMessage.name].push(queuedMessage);
}

function drainMakes(type: string): void {
  if (!queuedMakes[type]) {
    return;
  }

  queuedMakes[type].forEach((x) => { make(x.type, x.name, x.config, x.arg, x.overwrite); });

  queuedMakes[type] = [];
}

function drainMessages(name: string): void {
  if (!queuedMessages[name]) {
    return;
  }

  queuedMessages[name].forEach((x) => message(x.name, x.action, x.args || {}));

  queuedMessages[name] = [];
}

export function register(type: string, constructor: Constructor, overwrite: boolean = false): void {
  if (!type) {
    throw new Error("Type is required.");
  }
  if (constructors[type] && !overwrite) {
    return;
  }

  constructors[type] = constructor;

  drainMakes(type);
}

export function make(type: string, name: string, config: any, arg: any, overwrite: boolean = false): void {
  if (!type) {
    throw new Error("Type is required.");
  }
  if (!name) {
    throw new Error("Name is required.");
  }

  const constructor: Constructor = getConstructor(type);

  if (!constructor) {
    queueMakeCall({ type, name, config, arg, overwrite });
    return;
  }
  if (madeObjects[name] && !overwrite) {
    return;
  }

  madeObjects[name] = constructor(name, config, arg);

  drainMessages(name);
}

export function assign(name: string, obj: IBrokerObject, overwrite: boolean = false): void {
  if (!name) {
    throw new Error("Name is required.");
  }
  if (!obj) {
    throw new Error("Object is required.");
  }
  if (madeObjects[name] && !overwrite) {
    return;
  }

  madeObjects[name] = obj;

  drainMessages(name);
}

export function message(name: string, action: string, args: Record<string, any>): void {
  if (!name) {
    throw new Error("Name is required.");
  }
  if (!action) {
    throw new Error("Action is required.");
  }

  const constructedObject: IBrokerObject = getObject(name);

  if (!constructedObject) {
    queueMessage({ name, action, args });
    return;
  }

  emit(constructedObject, { name, action, args });
}

export function reset(): void {
  queuedMakes = {};
  madeObjects = {};
  constructors = {};
  queuedMessages = {};
}
