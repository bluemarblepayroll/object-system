'use strict';

var expect = require('chai').expect;
var Broker = require('../dist/broker.js').Broker;

describe('Broker#message', () => {

  describe('using receive actions object', () => {

    it('should properly message an object.', () => {

      let valueStick = { value: 0 };

      let testComponentConstructor = function(name, config, arg) {
        return {
          receive: {
            add: (args) => {
              valueStick.value += args.value;
            },
            subtract: (args) => {
              valueStick.value -= args.value;
            }
          }
        };
      }

      Broker.register('TestComponent', testComponentConstructor, true);

      Broker.make('TestComponent', 'TestComponent1', {}, null, true);

      Broker.message('TestComponent1', 'add', { value: 1 });

      expect(valueStick.value).to.equal(1);

      Broker.message('TestComponent1', 'subtract', { value: 1 });

      expect(valueStick.value).to.equal(0);
    });

  });

  describe('using receiveMessage function', () => {

    it('should properly message an object.', () => {

      let valueStick = { value: 0 };

      let testComponentConstructor = function(name, config, arg) {
        return {
          receiveMessage: (action, args) => {
            if (action === 'add') {
              valueStick.value += args.value;
            }
            else if (action === 'subtract') {
              valueStick.value -= args.value;
            }
          }
        };
      }

      Broker.register('TestComponent', testComponentConstructor, true);

      Broker.make('TestComponent', 'TestComponent1', {}, null, true);

      Broker.message('TestComponent1', 'add', { value: 1 });

      expect(valueStick.value).to.equal(1);

      Broker.message('TestComponent1', 'subtract', { value: 1 });

      expect(valueStick.value).to.equal(0);
    });

  });

});
