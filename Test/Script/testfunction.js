/* eslint-env jest */
const Log = require('log');

const logLevel = process.env.Loglevel || 'Info';
const log = new Log(logLevel);

// expectOutput =>
// 异常
// output: {
//   isError: true,
//   errMsg: '未指定schema',
// },
// 正常
// output: {
//   isError: false,
//   returnvalue: { a: 1 },
// },

function commonErrorCheck(actualError, expectOutput) {
  expect(true).toBe(expectOutput.isError);
  if (expectOutput.errMsg) {
    expect(actualError.message).toBe(expectOutput.errMsg);
  }
}

function check(actualvalue, expectvalue) {
  if (expectvalue) {
    switch (typeof expectvalue) {
      case 'string':
        expect(actualvalue).toBe(expectvalue);
        break;
      case 'boolean':
        expect(actualvalue).toBe(expectvalue);
        break;
      case 'number':
        expect(actualvalue).toBe(expectvalue);
        break;
      case 'object':
        if (expectvalue instanceof Array) {
          expect(actualvalue).toEqual(expect.arrayContaining(expectvalue));
        } else {
          expect(actualvalue).toEqual(expect.objectContaining(expectvalue));
        }
        break;
      default:
        log.error('invalid type ', typeof expectvalue);
    }
  }
}

function testdriver(data) {
  describe('共通模块测试', () => {
    describe.each(data.testdata)(
      data.description,
      (testdata) => {
        beforeEach(() => testdata.prepare());
        test(testdata.description, async () => {
          let normalcase = false;
          let result;
          try {
            const testFunc = testdata.testfun;
            const bindTestFunc = testFunc.bind(testdata.bindModel);
            result = await bindTestFunc(...testdata.params);
            normalcase = true;
          } catch (error) {
            try {
              expect(true).toBe(testdata.output.isError);
            } catch (error2) {
              log.error(`${testdata.description} was expected to be a normal case, but it was abnormal end`, error);
              throw error2;
            }
            try {
              expect(error.message).toBe(testdata.output.errMsg);
            } catch (error2) {
              log.error(testdata.description, `expect error ${testdata.output.errMsg} <> actual error ${error.message}`);
              throw error2;
            }
          }
          if (normalcase) {
            try {
              expect(false).toBe(testdata.output.isError);
            } catch (error) {
              log.error(`${testdata.description} was expected to be an error case, but it was normal end`);
              throw error;
            }
          }
          try {
            check(result, testdata.output.returnvalue);
          } catch (error) {
            log.error(testdata.description, `expect return value ${testdata.output.returnvalue} <> actual return value${result}`);
            throw error;
          }
          testdata.mocks.forEach((mock) => {
            if (mock.isCalled) {
              try {
                expect(mock.mockfunction).toHaveBeenCalled();
              } catch (error) {
                log.error(testdata.description, `${mock.mockfunction.name} was not called as expected`);
                throw error;
              }

              try {
                expect(
                  mock.mockfunction.mock.calls[0],
                ).toEqual(expect.arrayContaining(mock.expectParam));
              } catch (error) {
                log.error(testdata.description, `${mock.mockfunction.name} was called by params [${mock.mockfunction.mock.calls[0]}] while expect params is [${mock.expectParam}]`);
                throw error;
              }
            } else {
              try {
                expect(mock.mockfunction).not.toHaveBeenCalled();
              } catch (error) {
                log.error(testdata.description, `${mock.mockfunction.name} should not been called`);
                throw error;
              }
            }
          });
        });
      },
    );
  });
}

function commonReturnValueCheck(isNormal, actualResult, expectOutput) {
  if (isNormal) {
    expect(false).toBe(expectOutput.isError);
    check(actualResult, expectOutput.returnvalue);
  }
}

// expectMock =>
// {
// isCalled: true/false
// expectParam: [
// param1,
// param2,
// ]
// }
function commonMockFunCheck(mockFunc, expectMock) {
  if (expectMock.isCalled) {
    expect(mockFunc).toHaveBeenCalled();
    expect(
      mockFunc.mock.calls[0],
    ).toEqual(expect.arrayContaining(expectMock.expectParam));
  } else {
    expect(mockFunc).not.toHaveBeenCalled();
  }
}

module.exports.testdriver = testdriver;
module.exports.commonErrorCheck = commonErrorCheck;
module.exports.commonReturnValueCheck = commonReturnValueCheck;
module.exports.commonMockFunCheck = commonMockFunCheck;
