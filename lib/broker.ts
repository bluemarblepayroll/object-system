/**
 * Copyright (c) 2018-present, Blue Marble Payroll, LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { IComponent } from "./component";
import { emit, IMessage } from "./messenger";
import { Queue } from "./queue";
import { Registry } from "./registry";

export type Constructor = (name: string, config: Record<string, any>, arg: any) => IComponent;

interface IMake {
  type: string;
  name: string;
  config: Record<string, any>;
  arg: any;
}

const components: Registry<IComponent> = new Registry<IComponent>();
const constructors: Registry<Constructor> = new Registry<Constructor>();

const queuedMakes: Queue<IMake> = new Queue<IMake>();
const queuedMessages: Queue<IMessage> = new Queue<IMessage>();

function drainMakes(type: string): void {
  queuedMakes.popAll(type).forEach((x) => { make(x.type, x.name, x.config, x.arg); });
}

function drainMessages(name: string): void {
  queuedMessages.popAll(name).forEach((x) => message(x.name, x.action, x.args || {}));
}

export function register(type: string, constructor: Constructor, overwrite: boolean = false): void {
  if (!type) {
    throw new Error("Type is required.");
  }
  if (constructors[type] && !overwrite) {
    return;
  }

  constructors.add(type, constructor);

  drainMakes(type);
}

export function make(type: string, name: string, config: any, arg: any): void {
  if (!type) {
    throw new Error("Type is required.");
  }
  if (!name) {
    throw new Error("Name is required.");
  }

  const constructor: Constructor = constructors.find(type);

  if (!constructor) {
    queuedMakes.push(type, { type, name, config, arg });
    return;
  }

  components.add(name, constructor(name, config, arg));
  drainMessages(name);
}

export function assign(name: string, component: IComponent): void {
  if (!name) {
    throw new Error("Name is required.");
  }
  if (!component) {
    throw new Error("Object is required.");
  }

  components.add(name, component);
  drainMessages(name);
}

export function message(name: string, action: string, args: Record<string, any>): void {
  if (!name) {
    throw new Error("Name is required.");
  }
  if (!action) {
    throw new Error("Action is required.");
  }

  const component: IComponent = components.find(name);

  if (!component) {
    queuedMessages.push(name, { name, action, args });
    return;
  }

  emit(component, { name, action, args });
}

export function reset(): void {
  components.clear();
  constructors.clear();
  queuedMakes.clearAll();
  queuedMessages.clearAll();
}
