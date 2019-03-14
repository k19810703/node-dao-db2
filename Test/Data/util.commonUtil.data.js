const { DataError } = require('../../UserDefineError/dataError');

const data2WhereTestData = [
  {
    describe: '正常：一个项目',
    input: {
      field1: 'aaa',
    },
    errorcase: false,
    output: {
      sqlparam: ['aaa'], 
      sqlwhere: ' where field1 = ? ',
    },
  },
  {
    describe: '正常：二个项目',
    input: {
      field1: 'aaa',
      field2: '123',
    },
    errorcase: false,
    output: {
      sqlparam: ['aaa', '123'],
      sqlwhere: ' where field1 = ? and field2 = ? ',
    },
  },
  {
    describe: '正常：空',
    input: {
    },
    errorcase: false,
    output: {
      sqlparam: [],
      sqlwhere: '',
    },
  },
  {
    describe: '异常：多层级json对象',
    input: {
      a: {
        b: 1,
      },
    },
    errorcase: true,
    output: {
      message: '无法处理多层级json对象',
      errorobject: DataError,
    },
  },
  {
    describe: '异常：多层级json对象数组',
    input: {
      a: [1, 2],
    },
    errorcase: true,
    output: {
      message: '无法处理多层级json对象',
      errorobject: DataError,
    },
  },
];

const data2SetTestData = [];
const filedsarray2Order = [];

module.exports.data2WhereTestData = data2WhereTestData;
module.exports.data2SetTestData = data2SetTestData;
module.exports.filedsarray2Order = filedsarray2Order;
