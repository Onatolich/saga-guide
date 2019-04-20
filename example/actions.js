function success(payload) {
  return {
    type: 'SUCCESS',
    payload,
  };
}

function error(payload) {
  return {
    type: 'ERROR',
    payload,
  };
}

export default {
  success,
  error,
};
