require('./matchers');
const GuidedSaga = require('./GuidedSaga');

function guideSaga(saga, options) {
  return new GuidedSaga(saga, { ...options });
}

guideSaga.isGuidedSaga = value => value instanceof GuidedSaga;

module.exports = guideSaga;
