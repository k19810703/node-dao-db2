/* eslint-env jest */
const Database = require('../../database');
const {
  dummyResponse,
  dummyArrayResponse,
  dummyArrayResponseWith1Element,
} = require('../Data/commondata');

const {
  constructorData,
  commonCheckData,
  getfunctionData,
  retrieveAllData,
  retrieveData,
  retrieveOneData,
  retrieveCountData,
  createData,
  bulkCreateData,
  updateByConditionData,
  updateByKeyData,
  deleteByKeyData,
  deleteByConditionData,
} = require('../Data/dataModel.data');

jest.mock('../../util/log');
jest.mock('../../database');

describe('datamodel测试', () => {
  describe.each(constructorData)(
    '构造函数测试',
    (testdata) => {
      test(testdata.description, () => {
        let normalcase = false;
        try {
          const model = new testdata.BizModel(testdata.database);
          if (model) {
            normalcase = true;
          }
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
  describe.each(commonCheckData)(
    '标准check测试',
    (testdata) => {
      test(testdata.description, async () => {
        let normalcase = false;
        try {
          const model = new testdata.initialize.BizModel(testdata.initialize.database);
          delete model[testdata.initialize.propToeRemoved];
          await model.retrieveAll([]);
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
  describe.each(getfunctionData)(
    'get方法测试',
    (testdata) => {
      test(testdata.description, async () => {
        const model = new testdata.initialize.BizModel(testdata.initialize.database);
        const autosetfieldlist = model.getAutoSetFieldList();
        const keyfieldlist = model.getKeyFieldList();
        const fullschema = model.getFullSchema();
        const fieldlist = model.getFieldList();
        expect(fieldlist).toEqual(expect.arrayContaining(['a']));
        expect(autosetfieldlist).toEqual(expect.arrayContaining(['1', '2']));
        expect(keyfieldlist).toEqual(expect.arrayContaining(['3', '3']));
        expect(fullschema).toEqual(expect.objectContaining({ a: 1 }));
      });
    },
  );
  describe.each(retrieveAllData)(
    'retrieveAll测试',
    (testdata) => {
      beforeEach(() => {
        Database.prototype.beginTransaction = jest.fn();
        Database.prototype.commitTransaction = jest.fn();
        Database.prototype.executeSql = jest.fn().mockImplementationOnce(
          testdata.initialize.executeSql,
        );
      });

      test(testdata.description, async () => {
        const database = new Database();
        const model = new testdata.initialize.BizModel(database);
        let result;
        try {
          result = await model.retrieveAll(...testdata.input);
        } catch (error) {
          expect(true).toBe(testdata.check.isError);
          expect(error.message).toBe(testdata.check.errMsg);
        }
        if (testdata.check.returnvalue) {
          expect(result).toEqual(expect.objectContaining(dummyResponse));
        }
        if (testdata.check.executeSqlParam1) {
          expect(
            Database.prototype.executeSql.mock.calls[0][0],
          ).toBe(testdata.check.executeSqlParam1);
        }
      });
    },
  );

  describe.each(retrieveData)(
    'retrieve测试',
    (testdata) => {
      beforeEach(() => {
        Database.prototype.beginTransaction = jest.fn();
        Database.prototype.commitTransaction = jest.fn();
        Database.prototype.executeSql = jest.fn().mockImplementationOnce(
          testdata.initialize.executeSql,
        );
      });

      test(testdata.description, async () => {
        let result;
        let normalcase;
        try {
          const database = new Database();
          const model = new testdata.initialize.BizModel(database);
          result = await model.retrieve(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
          expect(result).toEqual(expect.arrayContaining(dummyArrayResponse));
          expect(
            Database.prototype.executeSql.mock.calls[0][0],
          ).toBe(testdata.output.executeSqlParam1);
          expect(
            Database.prototype.executeSql.mock.calls[0][1],
          ).toEqual(expect.arrayContaining(testdata.output.executeSqlParam2));
        }
      });
    },
  );
  describe.each(retrieveOneData)(
    'retrieveOne测试',
    (testdata) => {
      let model;
      beforeEach(() => {
        const database = new Database();
        model = new testdata.initialize.BizModel(database);
        model.retrieve = jest.fn().mockImplementationOnce(
          testdata.initialize.retrieve,
        );
      });

      test(testdata.description, async () => {
        let normalcase = false;
        let result;
        try {
          result = await model.retrieveOne(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (normalcase) {
          expect(result).toEqual(expect.objectContaining(dummyArrayResponseWith1Element[0]));
        }
        expect(
          model.retrieve.mock.calls[0][0],
        ).toEqual(expect.objectContaining(testdata.input[0]));
        expect(
          model.retrieve.mock.calls[0][1],
        ).toBe(testdata.input[1]);
        expect(
          model.retrieve.mock.calls[0][2],
        ).toEqual(expect.arrayContaining(testdata.input[2]));
        expect(
          model.retrieve.mock.calls[0][3],
        ).toBe(testdata.input[3]);
      });
    },
  );
  describe.each(retrieveCountData)(
    'retrieveCount测试',
    (testdata) => {
      beforeEach(() => {
        Database.prototype.beginTransaction = jest.fn();
        Database.prototype.commitTransaction = jest.fn();
        Database.prototype.executeSql = jest.fn().mockImplementationOnce(
          testdata.initialize.executeSql,
        );
      });

      test(testdata.description, async () => {
        const database = new Database();
        const model = new testdata.initialize.BizModel(database);
        let result;
        try {
          result = await model.retrieveCount(...testdata.input);
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (testdata.output.resultvalue) {
          expect(result).toBe(testdata.output.resultvalue);
        }
        if (testdata.output.executeSqlCall) {
          expect(
            Database.prototype.executeSql.mock.calls[0][0],
          ).toBe(testdata.output.executeSqlCall.param1);
          expect(
            Database.prototype.executeSql.mock.calls[0][1],
          ).toEqual(expect.arrayContaining(testdata.output.executeSqlCall.param2));
        }
      });
    },
  );

  describe.each(createData)(
    'create测试',
    (testdata) => {
      beforeEach(() => {
        Database.prototype.beginTransaction = jest.fn();
        Database.prototype.commitTransaction = jest.fn();
        Database.prototype.executeSql = jest.fn().mockImplementationOnce(
          testdata.initialize.executeSql,
        );
      });

      test(testdata.description, async () => {
        let result;
        let normalcase = false;
        try {
          const database = new Database();
          const model = new testdata.initialize.BizModel(database);
          result = await model.create(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (normalcase) {
          expect(result).toBe(testdata.output.resultvalue);
          expect(
            Database.prototype.executeSql.mock.calls[0][0],
          ).toBe(testdata.output.executeSqlParam1);
          expect(
            Database.prototype.executeSql.mock.calls[0][1],
          ).toEqual(expect.arrayContaining(testdata.output.executeSqlParam2));
        }
      });
    },
  );
  describe.each(bulkCreateData)(
    'bulkCreate测试',
    (testdata) => {
      beforeEach(() => {
        Database.prototype.beginTransaction = jest.fn();
        Database.prototype.commitTransaction = jest.fn();
        Database.prototype.executeSql = jest.fn().mockImplementationOnce(
          testdata.initialize.executeSql,
        );
      });

      test(testdata.description, async () => {
        let result;
        let normalcase = false;
        try {
          const database = new Database();
          const model = new testdata.initialize.BizModel(database);
          result = await model.bulkCreate(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (normalcase) {
          expect(result).toEqual(expect.objectContaining(testdata.output.resultvalue));
          if (testdata.output.isCalled) {
            expect(
              Database.prototype.executeSql.mock.calls[0][0],
            ).toBe(testdata.output.executeSqlParam1);
            expect(
              Database.prototype.executeSql.mock.calls[0][1],
            ).toEqual(expect.arrayContaining(testdata.output.executeSqlParam2));
          }
        }
      });
    },
  );
  describe.each(updateByConditionData)(
    'updateByCondition测试',
    (testdata) => {
      beforeEach(() => {
        Database.prototype.beginTransaction = jest.fn();
        Database.prototype.commitTransaction = jest.fn();
        Database.prototype.executeSql = jest.fn().mockImplementationOnce(
          testdata.initialize.executeSql,
        );
      });

      test(testdata.description, async () => {
        let result;
        let normalcase = false;
        try {
          const database = new Database();
          const model = new testdata.initialize.BizModel(database);
          result = await model.updateByCondition(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (normalcase) {
          expect(result).toBe(testdata.output.resultvalue);
          expect(
            Database.prototype.executeSql.mock.calls[0][0],
          ).toBe(testdata.output.executeSqlParam1);
          expect(
            Database.prototype.executeSql.mock.calls[0][1],
          ).toEqual(expect.arrayContaining(testdata.output.executeSqlParam2));
        }
      });
    },
  );
  describe.each(updateByKeyData)(
    'updateByKey测试',
    (testdata) => {
      let model;
      beforeEach(() => {
        const database = new Database();
        model = new testdata.initialize.BizModel(database);
        model.updateByCondition = jest.fn().mockImplementationOnce(
          testdata.initialize.updateByCondition,
        );
      });

      test(testdata.description, async () => {
        let result;
        let normalcase = false;
        try {
          result = await model.updateByKey(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (normalcase) {
          expect(result).toBe(testdata.output.resultvalue);
        }
        if (testdata.output.updateByCondition) {
          expect(
            model.updateByCondition.mock.calls[0][0],
          ).toEqual(expect.objectContaining(testdata.output.updateByCondition.param1));
          expect(
            model.updateByCondition.mock.calls[0][1],
          ).toEqual(expect.objectContaining(testdata.output.updateByCondition.param2));
        }
      });
    },
  );
  describe.each(deleteByKeyData)(
    'deleteByKey测试',
    (testdata) => {
      beforeEach(() => {
        Database.prototype.beginTransaction = jest.fn();
        Database.prototype.commitTransaction = jest.fn();
        Database.prototype.executeNonQuery = jest.fn().mockImplementationOnce(
          testdata.initialize.executeNonQuery,
        );
      });

      test(testdata.description, async () => {
        let normalcase = false;
        try {
          const database = new Database();
          const model = new testdata.initialize.BizModel(database);
          await model.deleteByKey(...testdata.input);
          normalcase = true;
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (normalcase) {
          expect(false).toBe(testdata.output.isError);
        }
        if (testdata.output.executeNonQuery) {
          expect(
            Database.prototype.executeNonQuery.mock.calls[0][0],
          ).toBe(testdata.output.executeNonQuery.param1);
          expect(
            Database.prototype.executeNonQuery.mock.calls[0][1],
          ).toEqual(expect.arrayContaining(testdata.output.executeNonQuery.param2));
        }
      });
    },
  );
  describe.each(deleteByConditionData)(
    'deleteByCondition测试',
    (testdata) => {
      beforeEach(() => {
        Database.prototype.beginTransaction = jest.fn();
        Database.prototype.commitTransaction = jest.fn();
        Database.prototype.executeNonQuery = jest.fn().mockImplementationOnce(
          testdata.initialize.executeNonQuery,
        );
      });

      test(testdata.description, async () => {
        try {
          const database = new Database();
          const model = new testdata.initialize.BizModel(database);
          await model.deleteByCondition(...testdata.input);
        } catch (error) {
          expect(true).toBe(testdata.output.isError);
          expect(error.message).toBe(testdata.output.errMsg);
        }
        if (testdata.output.executeNonQueryCall) {
          expect(
            Database.prototype.executeNonQuery.mock.calls[0][0],
          ).toBe(testdata.output.executeNonQueryCall.param1);
          expect(
            Database.prototype.executeNonQuery.mock.calls[0][1],
          ).toEqual(expect.arrayContaining(testdata.output.executeNonQueryCall.param2));
        }
      });
    },
  );
});
