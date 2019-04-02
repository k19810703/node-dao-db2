/* eslint-env jest */

const { Where } = require('../../index');

test('Condition异常case1 未指定项目名', () => {
  try {
    Where.base().wheresql();
  } catch (error) {
    expect(error.message).toBe('filename is not provided');
  }
});

test('Condition异常case2 项目名非字符型', () => {
  try {
    Where.base().wheresql(1);
  } catch (error) {
    expect(error.message).toBe('filename should be a string');
  }
});

test('Condition正常case 返回空字符串', () => {
  const sql = Where.base().wheresql('aa');
  expect(sql).toBe('');
});
