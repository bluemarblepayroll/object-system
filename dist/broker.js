"use strict";
exports.__esModule = true;
var Broker;
(function (Broker) {
    var queuedMakes = {}, madeObjects = {}, constructors = {}, queuedMessages = {};
    function getConstructor(type) {
        return constructors[type];
    }
    function getObject(name) {
        return madeObjects[name];
    }
    function queueMakeCall(makeCall) {
        if (!queuedMakes[makeCall.type]) {
            queuedMakes[makeCall.type] = [];
        }
        queuedMakes[makeCall.type].push(makeCall);
    }
    function queueMessage(queuedMessage) {
        if (!queuedMessages[queuedMessage.name]) {
            queuedMessages[queuedMessage.name] = [];
        }
        queuedMessages[queuedMessage.name].push(queuedMessage);
    }
    function drainMakes(type) {
        if (!queuedMakes[type]) {
            return;
        }
        queuedMakes[type].forEach(function (x) { return make(x.type, x.name, x.config, x.arg); });
        queuedMakes[type] = [];
    }
    function drainMessages(name) {
        if (!queuedMessages[name]) {
            return;
        }
        queuedMessages[name].forEach(function (x) { return message(x.name, x.action, x.args || {}); });
        queuedMessages[name] = [];
    }
    function register(type, constructor, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        if (constructors[type] && !overwrite) {
            return;
        }
        constructors[type] = constructor;
        drainMakes(type);
    }
    Broker.register = register;
    function make(type, name, config, arg, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        var constructor = getConstructor(type);
        if (!constructor) {
            queueMakeCall({ type: type, name: name, config: config, arg: arg, overwrite: overwrite });
            return;
        }
        if (madeObjects[name] && !overwrite) {
            return;
        }
        madeObjects[name] = constructor(name, config, arg);
        drainMessages(name);
    }
    Broker.make = make;
    function assign(name, obj, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        if (madeObjects[name] && !overwrite) {
            return;
        }
        madeObjects[name] = obj;
        drainMessages(name);
    }
    Broker.assign = assign;
    function message(name, action, args) {
        var constructedObject = getObject(name);
        if (!constructedObject) {
            queueMessage({ name: name, action: action, args: args });
            return;
        }
        if (constructedObject.receive && constructedObject.receive[action]) {
            constructedObject.receive[action](args);
        }
        else if (constructedObject.receive && !constructedObject.receive[action]) {
            throw "Object: " + name + " doest not respond to: " + action;
        }
        else if (constructedObject.receiveMessage) {
            constructedObject.receiveMessage(action, args);
        }
        else {
            throw "Cannot figure out how to message object: " + name;
        }
    }
    Broker.message = message;
})(Broker = exports.Broker || (exports.Broker = {}));
//# sourceMappingURL=broker.js.map