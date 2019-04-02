/* eslint-env jest */
// const moment = require('moment');

const {
  inputcheck,
  data2Where,
  data2Set,
  data2Insert,
  getFieldsFromObject,
} = require('../../util/commonUtil.js');
const {
  inputcheckData,
  data2WhereData,
  data2SetData,
  data2InsertData,
  getFieldsFromObjectData,
} = require('../Data/util.commonUtil.data');

jest.mock('../../util/log');

describe('共通模块测试', () => {
  describe.each(inputcheckData)(
    'inputcheck测试',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        try {
          await inputcheck(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
        }
      });
    },
  );

  describe.each(data2WhereData)(
    'data2Where方法测试',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = data2Where(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result).toEqual(expect.objectContaining(testdata.output.returnvalue));
        }
      });
    },
  );
  describe.each(data2SetData)(
    'data2Set测试',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = await data2Set(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result).toEqual(expect.objectContaining(testdata.output.returnvalue));
        }
      });
    },
  );

  describe.each(data2InsertData)(
    'data2Insert测试',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = await data2Insert(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result).toEqual(expect.objectContaining(testdata.output.returnvalue));
        }
      });
    },
  );
  describe.each(getFieldsFromObjectData)(
    'getFieldsFromObject测试',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = getFieldsFromObject(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
        }
        if (testdata.output.returnvalue) {
          expect(result).toEqual(expect.objectContaining(testdata.output.returnvalue));
        }
      });
    },
  );
});
