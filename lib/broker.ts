export namespace Broker {

  export interface ReceiveMessageFunc {
      (args:Record<string, any>):void;
  }

  export interface Object {
    receive?:Record<string, ReceiveMessageFunc>;
    receiveMessage?(action:string, args:Record<string, any>):void;
  }

  export interface Constructor {
      (name:string, config:Record<string, any>, arg:any):Object;
  }

  interface QueuedMake {
    type:string;
    name:string;
    config:Record<string, any>;
    arg:any;
    overwrite:boolean;
  }

  interface QueuedMessage {
    name:string;
    action:string;
    args:Record<string, any>;
  }

  const queuedMakes:Record<string, Array<QueuedMake>> = {},
        madeObjects:Record<string, Object> = {},
        constructors:Record<string, Constructor> = {},
        queuedMessages:Record<string, Array<QueuedMessage>> = {};

  function getConstructor(type:string) {
    return constructors[type];
  }

  function getObject(name:string):Object {
    return madeObjects[name];
  }

  function queueMakeCall(makeCall:QueuedMake):void {
    if (!queuedMakes[makeCall.type]) {
      queuedMakes[makeCall.type] = [];
    }

    queuedMakes[makeCall.type].push(makeCall);
  }

  function queueMessage(queuedMessage:QueuedMessage):void {
    if (!queuedMessages[queuedMessage.name]) {
      queuedMessages[queuedMessage.name] = [];
    }

    queuedMessages[queuedMessage.name].push(queuedMessage);
  }

  function drainMakes(type:string):void {
    if (!queuedMakes[type]) {
      return;
    }

    queuedMakes[type].forEach(x => make(x.type, x.name, x.config, x.arg));

    queuedMakes[type] = [];
  }

  function drainMessages(name:string):void {
    if (!queuedMessages[name]) {
      return;
    }

    queuedMessages[name].forEach(x => message(x.name, x.action, x.args || {}));

    queuedMessages[name] = [];
  }

  export function register(type:string, constructor:Constructor, overwrite:boolean = false):void {
    if (constructors[type] && !overwrite) {
      return;
    }

    constructors[type] = constructor;

    drainMakes(type);
  }

  export function make(type:string, name:string, config:any, arg:any, overwrite:boolean = false):void {
    let constructor:Constructor = getConstructor(type);

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

  export function assign(name:string, obj:Object, overwrite:boolean = false):void {
    if (madeObjects[name] && !overwrite) {
      return;
    }

    madeObjects[name] = obj;

    drainMessages(name);
  }

  export function message(name:string, action:string, args:Record<string, any>):void {
    let constructedObject = getObject(name);

    if (!constructedObject) {
      queueMessage({ name, action, args });

      return;
    }

    if (constructedObject.receive && constructedObject.receive[action]) {
      // Use new messaging format
      constructedObject.receive[action](args);
    } else if (constructedObject.receive && !constructedObject.receive[action]) {
      // Use new messaging format but cant find action function
      throw `Object: ${name} doest not respond to: ${action}`;
    } else if (constructedObject.receiveMessage) {
      // Use legacy messaging format
      constructedObject.receiveMessage(action, args);
    } else {
      throw `Cannot figure out how to message object: ${name}`;
    }
  }
}
