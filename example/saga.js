import { put, select } from 'redux-saga/effects';
import api from './api';
import actions from './actions';

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
