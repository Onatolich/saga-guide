# saga-guide

Easy to use, framework agnostic saga testing utility.
It provides you with everything necessary to test your saga by wrapping it in a guided execution environment, and then track which actions was executed or error was thrown.

## Getting started

### Installation
```sh
npm install --save-dev saga-guide
```

### Importing to your application
```sh
import sagaGuide from 'saga-guide';
// OR
const sagaGuide = require('saga-guide');
```

## API reference
#### `sagaGuide(saga: Function, options?: Object): guidedSaga`
Creates guided saga instance.
1. `saga` - a saga you want to guide
2. `options` - an optional object of saga execution options. It should match options list of [runSaga](https://redux-saga.js.org/docs/api/#runsagaoptions-saga-args) util of [redux-saga](https://github.com/redux-saga/redux-saga). However, there is a single `saga-guide` specific option:
    * `state : any` - state which should be used for `select` effect.

#### `guidedSaga.run(...args: Array<any>): void`
Runs guided saga with passed arguments.
```js
function* saga(arg1, arg2) {...}
const guidedSaga = sagaGuide(saga);
guidedSaga.run('arg1 value', 'arg2 value');
```
You might run your guided saga as many times as you need. Before each run caught `error` and `dispatchState` will be reset.

#### `guidedSaga.wasActionDispatched(action: Object): boolean`
Returns true, if during last run was dispatched exactly the same action with exactly the same params (compared with deep-equal) as the passed one.

```js
const action = actionCreator(params);
expect(guidedSaga.wasActionDispatched(action))
    .toBeTruthy();
```

#### `guidedSaga.getAllDispatchedActionsByType(type: string): Array<Object>`
Returns list of all dispatched actions during last run by passed action type.
It might be useful if you have to check how many times some particular action was called.
```js
expect(guidedSaga.getAllDispatchedActionsByType('actionType'))
    .toHaveLength(3);
```

#### `guidedSaga.getDispatchStack(): Array<Object>`
Returns list of all dispatched actions during last run in order they were dispatched.
Could be used to debug your tests by looking on an actual dispatch stack.

```js
expect(guidedSaga.getDispatchStack())
    .toHaveLength(3);
```

#### `guidedSaga.getResult(): any`
Returns a result that was returned by guided saga during the last run if present.

```js
expect(guidedSaga.getResult())
  .toEqual('Expected return result');
```

#### `guidedSaga.getError(): ?Error`
Returns an error that was thrown during the last run if present.

```js
expect(guidedSaga.getError())
    .toBe(saga.UnauthorisedException);

// Or
expect(!!guidedSaga.getError())
    .toBeTruthy();
    
// Or
expect(guidedSaga.getError())
    .toMatchObject({ message: 'error message' });
```

#### `guidedSaga.setState(state: any): void`
Allows you to set state which will be used to resolve `select` effect. (See [Resolving state](#resolving-state) section)
```js
guidedSaga.setState({ key: 'value' });
```

## Resolving state
If you are using `select` effect in your sagas, then you would like to mock your redux state for testing. For this you have 2 possibilities:
- Define state with `getState` option during initialization
```js
sagaGuide(saga, {
    getState: () => ({ key: 'value' }),
});
```
- Define state with `guidedSaga` state management possibilities
```js
const guidedSaga = sagaGuide(saga, {
    state: { key: 'value' }, // This is optional
});
...
guidedSaga.setState({ key: 'new value' });
```

## Custom expect matchers
###### Note: Currently we are supporting only [Jest](https://jestjs.io/) custom matchers

#### `toDispatchAction`
Allows you to check whether some specific action was dispatched or not. 
```js
expect(guidedSaga).toDispatchAction(action);
// Equals to
expect(guidedSaga.wasActionDispatched(action)).toBeTruthy();
```
However, in case of wrong assertion **toDispatchAction** matcher will tell you which actions was dispatched during the last run, so it will be easier to debug your test this way.

#### `toDispatchActionType`
Allows you to check if an action with specified type was dispatched at least once during last run.
The difference with [toDispatchAction](#todispatchaction) matcher is that `toDispatchActionType` will check only type without any additional payload.

This could be useful for `.not` assertions like:
```js
expect(guidedSaga).toDispatchActionType(actionTypes.type);
expect(guidedSaga).not.toDispatchActionType(actionTypes.type);
```

Or you can pass an action instead of type. In this case matcher will automatically get passed action's type for an assertion:
```js
const action = { type: actionTypes.type };

expect(guidedSaga).toDispatchActionType(action);
expect(guidedSaga).not.toDispatchActionType(action);
```

## Example

Consider having next saga:
```js
import { put, select } from 'redux-saga/effects';
import api from '../api';
import actions from '../actions';

export default function* saga(arg1) {
    const storedData = yield select(state => state.data);

    try {
        const loadedData = yield api.loadSomeData(arg1, storedData);
        yield put(actions.success(loadedData));
    } catch (e) {
        yield put(actions.error(e.message));
        throw e;
    }
}
```

Our test will be as simple as this:
```js
import sagaGuide from 'saga-guide';
import api from '../api';
import actions from '../actions';
import saga from './saga';

const arg1 = 'arg1 value';
const state = { data: 'some data' };
const responseData = 'resonse data';

const guidedSaga = sagaGuide(saga, { state });

beforeEach(() => {
    jest.spyOn(api, 'loadSomeData').mockReturnValue(responseData);
    guidedSaga.run(arg1);
});

test('should load data from api with correct params', () => {
    expect(api.loadSomeData)
        .toHaveBeenCalledWith(arg1, state.data);
});

test('should dispatch success action with data loaded from api', () => {
    expect(guidedSaga)
        .toDispatchAction(actions.success(responseData));
});

describe('error flow', () => {
    const error = new Error('error message');

    beforeEach(() => {
        api.loadSomeData.mockImplementation(() => { throw error; });
        guidedSaga.run(arg1);
    });
    
    test('should dispatch error action with error message thrown', () => {
        expect(guidedSaga)
              .toDispatchAction(actions.error(error.message));
    });
    
    test('should throw error further', () => {
        expect(guidedSaga.getError())
            .toBe(error);
    });
});
```
