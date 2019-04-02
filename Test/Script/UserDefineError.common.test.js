/* eslint-env jest */

const { DefaultBizError } = require('../../UserDefineError/DefaultBizError');

test('DefaultBizError', () => {
  try {
    throw new DefaultBizError('test');
  } catch (error) {
    expect(error.message).toBe('test');
  }
});
