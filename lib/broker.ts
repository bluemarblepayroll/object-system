/**
 * Copyright (c) 2018-present, Blue Marble Payroll, LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
 
export type ReceiveMessageFunc = (messageId: number, args: Record<string, any>) => void;

export interface IBrokerObject {
  receive?: Record<string, ReceiveMessageFunc>;
  receiveMessage?(messageId: number, action: string, args: Record<string, any>): void;
}

export type Constructor = (name: string, config: Record<string, any>, arg: any) => IBrokerObject;

interface IQueuedMake {
  type: string;
  name: string;
  config: Record<string, any>;
  arg: any;
  overwrite: boolean;
}

interface IQueuedMessage {
  name: string;
  action: string;
  args: Record<string, any>;
}

let queuedMakes: Record<string, IQueuedMake[]> = {};
let madeObjects: Record<string, IBrokerObject> = {};
let constructors: Record<string, Constructor> = {};
let queuedMessages: Record<string, IQueuedMessage[]> = {};
let lastMessageId: number = 0;

function nextMessageId(): number {
  return lastMessageId++;
}

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

function queueMessage(queuedMessage: IQueuedMessage): void {
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

  if (constructedObject.receive && constructedObject.receive[action]) {
    // Use new messaging format
    constructedObject.receive[action](nextMessageId(), args);
  } else if (constructedObject.receive && !constructedObject.receive[action]) {
    // Use new messaging format but cant find action function
    throw new Error(`Object: ${name} does not respond to: ${action}`);
  } else if (constructedObject.receiveMessage) {
    // Use legacy messaging format
    constructedObject.receiveMessage(nextMessageId(), action, args);
  } else {
    throw new Error(`Cannot figure out how to message object: ${name}`);
  }
}

export function reset(): void {
  queuedMakes = {};
  madeObjects = {};
  constructors = {};
  queuedMessages = {};
}
