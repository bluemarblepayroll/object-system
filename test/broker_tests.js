'use strict';

var expect = require('chai').expect;
var Broker = require('../dist/broker.js');

describe('Broker#message', () => {

  describe('using receive actions object', () => {

    beforeEach(function() {
      Broker.reset();
    });

    it('should properly message an object.', () => {

      let valueStick = { value: 0 };

      let testComponentConstructor = function(name, config, arg) {
        return {
          receive: {
            add: (msgId, args) => {
              valueStick.value += args.value;
            },
            subtract: (msgId, args) => {
              valueStick.value -= args.value;
            }
          }
        };
      }

      Broker.register('TestComponent', testComponentConstructor);

      Broker.make('TestComponent', 'TestComponent1', {}, null);

      Broker.message('TestComponent1', 'add', { value: 1 });

      expect(valueStick.value).to.equal(1);

      Broker.message('TestComponent1', 'subtract', { value: 1 });

      expect(valueStick.value).to.equal(0);
    });

    it('should throw an error if an object does not respond to an action.', () => {

      let valueStick = { value: 0 };

      let testComponentConstructor = function(name, config, arg) {
        return {
          receive: {
            add: (msgId, args) => {
              valueStick.value += args.value;
            },
            subtract: (msgId, args) => {
              valueStick.value -= args.value;
            }
          }
        };
      }

      Broker.register('TestComponent', testComponentConstructor);

      let name = 'TestComponent1';

      Broker.make('TestComponent', name, {}, null);

      let action = 'noAction';

      expect(() => {
        Broker.message(name, action, { value: 1 });
      }).to.throw(`Object: ${name} does not respond to: ${action}`);

    });

    it('should properly queue makes and messages.', () => {

      let valueStick = { value: 0 };

      let testComponentConstructor = function(name, config, arg) {
        return {
          receive: {
            add: (msgId, args) => {
              valueStick.value += args.value;
            },
            subtract: (msgId, args) => {
              valueStick.value -= args.value;
            }
          }
        };
      }

      let componentName = 'TestComponent';
      let objectName = 'TestComponent1';

      Broker.message(objectName, 'add', { value: 1 });

      Broker.make(componentName, objectName, {}, null);

      Broker.register(componentName, testComponentConstructor);

      expect(valueStick.value).to.equal(1);

    });

  });

  describe('using receiveMessage function', () => {

    beforeEach(function() {
      Broker.reset();
    });

    it('should properly message an object.', () => {

      let valueStick = { value: 0 };

      let testComponentConstructor = function(name, config, arg) {
        return {
          receiveMessage: (msgId, action, args) => {
            if (action === 'add') {
              valueStick.value += args.value;
            }
            else if (action === 'subtract') {
              valueStick.value -= args.value;
            }
          }
        };
      }

      Broker.register('TestComponent', testComponentConstructor);

      Broker.make('TestComponent', 'TestComponent1', {}, null);

      Broker.message('TestComponent1', 'add', { value: 1 });

      expect(valueStick.value).to.equal(1);

      Broker.message('TestComponent1', 'subtract', { value: 1 });

      expect(valueStick.value).to.equal(0);
    });

  });

});
