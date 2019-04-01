/* eslint-env jest */
// const moment = require('moment');

const {
  inputcheck,
  data2Where,
  data2Like,
  data2Set,
  data2Insert,
  filedsarray2Order,
  getFieldsFromObject,
  checkData,
  strictCheckData,
  db2timestamp2moment,
  db2timestampgap,
  momenttimestampgap,
  getCurrentTimestampString,
  getCurrentTimestamp,
  db2timestampFormatForUI,
} = require('../../util/commonUtil.js');
const {
  inputcheckData,
  data2WhereData,
  data2LikeData,
  data2SetData,
  data2InsertData,
  filedsarray2OrderData,
  getFieldsFromObjectData,
  checkDataData,
  strictCheckDataData,
  db2timestamp2momentData,
  db2timestampgapData,
  momenttimestampgapData,
  getCurrentTimestampStringData,
  getCurrentTimestampData,
  db2timestampFormatForUIData,
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

  describe.each(data2LikeData)(
    'data2Likeテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = await data2Like(...testdata.input);
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
  describe.each(filedsarray2OrderData)(
    'filedsarray2Orderテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = await filedsarray2Order(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result).toBe(testdata.output.returnvalue);
        }
      });
    },
  );
  describe.each(getFieldsFromObjectData)(
    'getFieldsFromObjectテスト',
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

  describe.each(checkDataData)(
    'checkDataテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        try {
          await checkData(...testdata.input);
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
      });
    },
  );

  describe.each(strictCheckDataData)(
    'strictCheckテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        try {
          await strictCheckData(...testdata.input);
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
      });
    },
  );
  describe.each(db2timestampFormatForUIData)(
    'db2timestampFormatForUIテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = db2timestampFormatForUI(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result.toString()).toBe(testdata.output.returnvalue.toString());
        }
      });
    },
  );
  describe.each(db2timestamp2momentData)(
    'db2timestamp2momentテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = db2timestamp2moment(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result.toString()).toBe(testdata.output.returnvalue.toString());
        }
      });
    },
  );
  describe.each(db2timestampgapData)(
    'db2timestampgapテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = db2timestampgap(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result).toBe(testdata.output.returnvalue);
        }
      });
    },
  );
  describe.each(momenttimestampgapData)(
    'momenttimestampgapテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = momenttimestampgap(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result).toBe(testdata.output.returnvalue);
        }
      });
    },
  );
  describe.each(getCurrentTimestampStringData)(
    'getCurrentTimestampStringテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = getCurrentTimestampString(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          if (testdata.output.returnvalue) {
            expect(result).toBe(testdata.output.returnvalue);
          }
        }
      });
    },
  );
  describe.each(getCurrentTimestampData)(
    'getCurrentTimestampテスト',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = getCurrentTimestamp(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          if (testdata.output.errMsg) {
            expect(error.message).toBe(testdata.output.errMsg);
          }
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect((result - testdata.output.returnvalue) < 300).toBe(true);
        }
      });
    },
  );
});
