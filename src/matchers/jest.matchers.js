const GuidedSaga = require('../GuidedSaga');

try {
  require('jest');

  expect.extend({
    toDispatchAction(guidedSaga, action) {
      if (!(guidedSaga instanceof GuidedSaga)) {
        throw new Error('Expect value must be an instance of GuidedSaga');
      }

      const options = {
        isNot: this.isNot,
        promise: this.promise,
      };

      const passed = guidedSaga.wasActionDispatched(action);

      if (passed) {
        return {
          message: () => {
            return this.utils.matcherHint('.toDispatchAction', undefined, undefined, options) +
              '\n\n' +
              `Expected ${guidedSaga.getName()} to not dispatch ${this.utils.printExpected(action)} but it was dispatched`
          },
          pass: true,
        };
      }

      return {
        message: () => {
          return this.utils.matcherHint('.toDispatchAction', undefined, undefined, options) +
            '\n\n' +
            `Expected ${guidedSaga.getName()} to dispatch ${this.utils.printExpected(action)} but it was dispatched with:\n` +
            guidedSaga.getDispatchStack().map(this.utils.printReceived).join('\n');
        },
        pass: false,
      };
    },
  });
} catch (e) {}
