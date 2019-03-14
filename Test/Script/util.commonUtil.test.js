/* eslint-env jest */

const { data2Where } = require('../../util/commonUtil.js');
const utiltestdata = require('../Data/util.commonUtil.data.js');
const { DataError } = require('../../UserDefineError/dataError');

jest.mock('../../util/log');


describe('commonUtil测试', () => {
  describe.each(utiltestdata.data2WhereTestData)(
    'data2Where测试',
    (testdata) => {
      test(testdata.describe, () => {
        try {
          const result = data2Where(testdata.input);
          expect(testdata.errorcase).toBe(false);
          expect(result).toEqual(expect.objectContaining(testdata.output));
        } catch (error) {
          expect(testdata.errorcase).toBe(true);
          expect(error).toBeInstanceOf(testdata.output.errorobject);
        }
      });
    },
  );
});
