import sagaGuide from 'saga-guide';
import api from './api';
import actions from './actions';
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
