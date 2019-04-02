const Joi = require('joi');
const { Condition } = require('../../index');


module.exports.inputcheckData = [
  {
    description: '正常case 数据结构和schema相同',
    input: [
      {
        a: 1,
        b: 'aa',
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
      true,
    ],
    output: {
      isError: false,
    },
  },
  {
    description: '正常case 非严格模式 数据项目字段多于schema',
    input: [
      {
        a: 1,
        b: 'aa',
        c: 'cccc',
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
    ],
    output: {
      isError: false,
    },
  },
  {
    description: '异常case 严格模式 数据项目字段多于schema',
    input: [
      {
        a: 1,
        b: 'aa',
        c: 'cccc',
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
      true,
    ],
    output: {
      isError: true,
      errMsg: '"c" is not allowed',
    },
  },
  {
    description: '异常case, 数据不符合schema',
    input: [
      {
        a: 'ad',
        b: 'aa',
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
    ],
    output: {
      isError: true,
      errMsg: 'child "a" fails because ["a" must be a number]',
    },
  },
  {
    description: '异常case, 参数3非boolean型',
    input: [
      {
        a: 1,
        b: 'aa',
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
      1,
    ],
    output: {
      isError: true,
      errMsg: 'inputcheck的第三参数必须是boolean型',
    },
  },
];
module.exports.data2WhereData = [
  {
    description: '正常case(包含数字，字符，Condition的各种类型(like,>,>=,<,<=)',
    input: [
      {
        a: 1,
        b: 'abc',
        c: Condition.base().like('a%c'),
        d: Condition.base().greater('a'),
        e: Condition.base().greaterequal('b'),
        f: Condition.base().less('e'),
        g: Condition.base().lessequal('f'),
        h: Condition.base().greater(0).lessequal(99),
      },
    ],
    output: {
      isError: false,
      returnvalue: {
        sqlwhere: ' where  a = ?  and  b = ?  and  c like ?  and  d > ?  and  e >= ?  and  f < ?  and  g <= ?  and  h > ?  and  h <= ?  ',
        sqlparam: [1, 'abc', 'a%c', 'a', 'b', 'e', 'f', 0, 99],
      },
    },
  },
  {
    description: '正常case: 不传入参数',
    input: [
    ],
    output: {
      isError: false,
      returnvalue: {
        sqlwhere: '',
        sqlparam: [],
      },
    },
  },
  {
    description: '异常case: 传入参数但是无字段',
    input: [
      {},
    ],
    output: {
      isError: true,
      errMsg: '未指定where条件，如不希望指定where条件，请不要传入参数',
    },
  },
];
module.exports.data2SetData = [
  {
    description: '正常case: 数据字段和schema字段相同',
    input: [
      {
        a: 1,
        b: 'aa',
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
    ],
    output: {
      isError: false,
      returnvalue: {
        sql: ' set a = ? , b = ? ',
        sqlparam: [1, 'aa'],
      },
    },
  },
  {
    description: '正常case: 数据字段少于schema字段相同',
    input: [
      {
        a: 1,
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
    ],
    output: {
      isError: false,
      returnvalue: {
        sql: ' set a = ? ',
        sqlparam: [1],
      },
    },
  },
  {
    description: '异常case: 数据字段多余schema字段',
    input: [
      {
        a: 1,
        b: 'abc',
        c: 'asdf',
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
    ],
    output: {
      isError: true,
    },
  },
  {
    description: '异常case: 数据模型没有字段',
    input: [
      {
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
      },
    ],
    output: {
      isError: true,
      errMsg: 'set项目未设定',
    },
  },
];
module.exports.data2InsertData = [
  {
    description: '正常case',
    input: [
      {
        a: 1,
        b: 'aa',
      },
      {
        a: Joi.number().required(),
        b: Joi.string().required(),
        c: Joi.any(),
      },
    ],
    output: {
      isError: false,
      returnvalue: {
        sql: '(a , b) values (? , ?)',
        sqlparam: [1, 'aa'],
      },
    },
  },
  {
    description: '异常case: layout不正确',
    input: [
      {
        a: 'aaa',
      },
      {
        a: Joi.number().required(),
      },
    ],
    output: {
      isError: true,
      errMsg: 'child "a" fails because ["a" must be a number]',
    },
  },
];
module.exports.getFieldsFromObjectData = [
  {
    description: '正常case: 非严格模式 输入数据结构的字段和字段列表相同',
    input: [
      {
        a: 1,
        b: 'aa',
        c: 'CURRENT_TIMESTAMP',
      },
      ['a', 'b', 'd'],
    ],
    output: {
      isError: false,
      returnvalue: {
        a: 1,
        b: 'aa',
      },
    },
  },
  {
    description: '异常case: 参数2非数组类型',
    input: [
      {
        a: 1,
        b: 'aa',
        c: 'CURRENT_TIMESTAMP',
      },
      { a: 1 },
    ],
    output: {
      isError: true,
      errMsg: '参数2非数组类型',
    },
  },
  {
    description: '正常case: 非严格模式 数据模型中字段不足',
    input: [
      {
        a: 1,
        b: 'aa',
        c: 'CURRENT_TIMESTAMP',
      },
      ['a', 'b', 'c', 'd'],
    ],
    output: {
      isError: false,
      returnvalue: {
        a: 1,
        b: 'aa',
        c: 'CURRENT_TIMESTAMP',
      },
    },
  },
  {
    description: '异常case: 严格模式 数据模型中字段不足',
    input: [
      {
        a: 1,
        b: 'aa',
        c: 'CURRENT_TIMESTAMP',
      },
      ['a', 'b', 'c', 'd'],
      true,
    ],
    output: {
      isError: true,
      errMsg: '主key字段d不存在',
    },
  },
  {
    description: '正常case: 非严格模式 数据模型中存在字段列表外的字段',
    input: [
      {
        a: 1,
        b: 'aa',
        c: 'CURRENT_TIMESTAMP',
      },
      ['a', 'b'],
      true,
    ],
    output: {
      isError: false,
      returnvalue: {
        a: 1,
        b: 'aa',
      },
    },
  },
];
