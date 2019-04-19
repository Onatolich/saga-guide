const GuidedSaga = require('./GuidedSaga');

function guideSaga(saga, options) {
  return new GuidedSaga(saga, { ...options });
}

module.exports = guideSaga;
