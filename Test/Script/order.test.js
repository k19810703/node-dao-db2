/* eslint-env jest */

const { Order } = require('../../index');

test('Order正常case 返回空字符串', () => {
  const sql = Order.base().ordersql();
  expect(sql).toBe('');
});
