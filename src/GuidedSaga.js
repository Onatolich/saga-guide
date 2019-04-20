const { runSaga } = require('redux-saga');
const deepEqual = require('deep-equal');

/**
 * Guided saga wrapper which allows to run passed saga with passed options,
 * changes state in the runtime, determine errors thrown by saga and
 * which actions was dispatched during the execution.
 */
class GuidedSaga {
  constructor(saga, options) {
    this.state = options.state;
    this.error = undefined;
    this.dispatchStack = [];

    this.saga = saga;
    this.options = options;
  }

  /**
   * Saga dispatch handler.
   * Writes dispatched action to dispatch stack and executes dispatch handler passed as an option if present.
   */
  onDispatch(action) {
    this.dispatchStack.push(action);

    if (this.options.dispatch instanceof Function) {
      this.options.dispatch(action);
    }
  }

  /**
   * Saga error handler.
   * Memorises thrown error and executes error handler passed as an option if present.
   */
  onError(e) {
    this.error = e;
    if (this.options.onError instanceof Function) {
      this.options.onError(e);
    }
  }

  /**
   * Returns name of guided saga.
   */
  getName() {
    return this.saga.name;
  }

  /**
   * Allows to change state between different runs of saga.
   * Note: state passed via either this method or options.state will cause to ignore options.getState if it is present.
   */
  setState(state) {
    if (this.options.getState instanceof Function) {
      console.warn('You are using setState with getState option specified during initialization. The last one will be ignored.');
    }
    this.state = state;
  }

  /**
   * Returns current state with next priority:
   * 1. Memorised state from attribute,
   * 2. options.getState method,
   * 3. Empty object.
   */
  getState() {
    if (this.state) {
      return this.state;
    }

    if (this.options.getState instanceof Function) {
      return this.options.getState();
    }

    return {};
  }

  /**
   * Returns a copy of dispatch stack for the last run.
   */
  getDispatchStack() {
    return [...this.dispatchStack];
  }

  /**
   * Returns true if during last run was dispatched
   * exactly the same action with exactly the same params (compared with deep-equal) as the passed one.
   */
  wasActionDispatched(action) {
    return this.dispatchStack.some(dispatchedAction => deepEqual(dispatchedAction, action));
  }

  /**
   * Returns a list of all dispatched actions with passed action type.
   */
  getAllDispatchedActionsByType(type) {
    return this.dispatchStack.filter(action => action.type === type);
  }

  /**
   * Returns an error thrown during the last run if present.
   */
  getError() {
    return this.error;
  }

  /**
   * Returns run config which should be passed to runSaga.
   */
  getRunConfig() {
    return {
      ...this.options,
      dispatch: this.onDispatch.bind(this),
      getState: this.getState.bind(this),
      onError: this.onError.bind(this),
    };
  }

  /**
   * Resets guided saga state between different runs.
   */
  reset() {
    this.error = undefined;
    this.dispatchStack = [];
  }

  /**
   * Runs guided saga with passed arguments.
   */
  async run(...args) {
    this.reset();

    try {
      await runSaga(this.getRunConfig(), this.saga, ...args).done;
    } catch (e) {}
  }
}

module.exports = GuidedSaga;
