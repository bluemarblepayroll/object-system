import { expect } from "chai";
import * as Broker from "../lib/broker";

describe("Broker#message", () => {
  describe("using receive actions object", () => {

    beforeEach(() => {
      Broker.reset();
    });

    it("should properly message an object.", () => {
      const valueStick = { value: 0 };

      const testComponentConstructor = () => {
        return {
          receive: {
            add: (_, args) => {
              valueStick.value += args.value;
            },
            subtract: (_, args) => {
              valueStick.value -= args.value;
            },
          },
        };
      };

      Broker.register("TestComponent", testComponentConstructor);

      Broker.make("TestComponent", "TestComponent1", {}, null);

      Broker.message("TestComponent1", "add", { value: 1 });

      expect(valueStick.value).to.equal(1);

      Broker.message("TestComponent1", "subtract", { value: 1 });

      expect(valueStick.value).to.equal(0);
    });

    it("should throw an error if an object does not respond to an action.", () => {
      const valueStick = { value: 0 };

      const testComponentConstructor = () => {
        return {
          receive: {
            add: (_, args) => {
              valueStick.value += args.value;
            },
            subtract: (_, args) => {
              valueStick.value -= args.value;
            },
          },
        };
      };

      Broker.register("TestComponent", testComponentConstructor);

      const name = "TestComponent1";

      Broker.make("TestComponent", name, {}, null);

      const action = "noAction";

      expect(() => {
        Broker.message(name, action, { value: 1 });
      }).to.throw(`Object: ${name} does not respond to: ${action}`);
    });

    it("should properly queue makes and messages.", () => {
      const valueStick = { value: 0 };

      const testComponentConstructor = () => {
        return {
          receive: {
            add: (_, args) => {
              valueStick.value += args.value;
            },
            subtract: (_, args) => {
              valueStick.value -= args.value;
            },
          },
        };
      };

      const componentName = "TestComponent";
      const objectName = "TestComponent1";

      Broker.message(objectName, "add", { value: 1 });

      Broker.make(componentName, objectName, {}, null);

      Broker.register(componentName, testComponentConstructor);

      expect(valueStick.value).to.equal(1);
    });
  });

  describe("using receiveMessage function", () => {
    beforeEach(() => {
      Broker.reset();
    });

    it("should properly message an object.", () => {
      const valueStick = { value: 0 };

      const testComponentConstructor = () => {
        return {
          receiveMessage: (_, action, args) => {
            if (action === "add") {
              valueStick.value += args.value;
            } else if (action === "subtract") {
              valueStick.value -= args.value;
            }
          },
        };
      };

      Broker.register("TestComponent", testComponentConstructor);

      Broker.make("TestComponent", "TestComponent1", {}, null);

      Broker.message("TestComponent1", "add", { value: 1 });

      expect(valueStick.value).to.equal(1);

      Broker.message("TestComponent1", "subtract", { value: 1 });

      expect(valueStick.value).to.equal(0);
    });
  });
});
