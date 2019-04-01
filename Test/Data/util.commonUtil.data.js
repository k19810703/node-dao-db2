const Joi = require('joi');
const moment = require('moment');
const { Condition } = require('../../index');

const constdata = require('../../util/constdata');

module.exports.inputcheckData = [
  {
    description: '正常ケース　スキーマ以外の項目なし',
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
    },
  },
  {
    description: '正常ケース スキーマ以外の項目あり',
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
    description: '異常ケース',
    input: [
      {
        a: 'ad',
        b: 'aa',
        c: 'cccc',
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
module.exports.data2LikeData = [
  {
    description: '正常ケース　データ項目がスキーマにある',
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
        sqlwhere: ' where a like ? and b like ? ',
        sqlparam: [1, 'aa'],
      },
    },
  },
  {
    description: '正常ケース　データ項目が一個だけ',
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
        sqlwhere: ' where a like ? ',
        sqlparam: [1],
      },
    },
  },
  {
    description: '異常ケース　スキーマ定義以外項目あり',
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
    description: '異常ケース　データなし',
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
      errMsg: 'where条件ありません',
    },
  },
  {
    description: '異常ケース　複数階層あり',
    input: [
      {
        a: { b: 1 },
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
      errMsg: '字段d不存在',
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
module.exports.db2timestamp2momentData = [
  {
    description: '正常ケース',
    input: [
      '2019-03-27-02.50.32.150969',
    ],
    output: {
      isError: false,
      returnvalue: moment.utc('2019-03-27 02:50:32'),
    },
  },
  {
    description: '異常ケース、日付ではありません',
    input: [
      '2019-03-32-02.50.32.150969',
    ],
    output: {
      isError: true,
      errMsg: '2019-03-32-02.50.32.150969が日付形式ではありません',
    },
  },
];
module.exports.db2timestampgapData = [
  {
    description: '正常ケース +',
    input: [
      '2019-03-27-02.50.32.150969',
      '2019-03-27-22.12.45.150969',
    ],
    output: {
      isError: false,
      returnvalue: 69733,
    },
  },
  {
    description: '正常ケース -',
    input: [
      '2019-03-27-22.12.45.150969',
      '2019-03-27-02.50.32.150969',
    ],
    output: {
      isError: false,
      returnvalue: -69733,
    },
  },
];
module.exports.momenttimestampgapData = [
  {
    description: '正常ケース +',
    input: [
      moment('2019-03-27 02:50:32'),
      moment('2019-03-27 22:12:45'),
    ],
    output: {
      isError: false,
      returnvalue: 69733,
    },
  },
  {
    description: '正常ケース -',
    input: [
      moment('2019-03-27 22:12:45'),
      moment('2019-03-27 02:50:32'),
    ],
    output: {
      isError: false,
      returnvalue: -69733,
    },
  },
];
module.exports.getCurrentTimestampStringData = [
  {
    description: '正常ケース YYYYMMDD',
    input: [
      'YYYYMMDD',
    ],
    output: {
      isError: false,
      returnvalue: moment().utc().format('YYYYMMDD').toString(),
    },
  },
  {
    description: '正常ケース YYYYMMDDhhmm',
    input: [
      'YYYYMMDDhhmm',
    ],
    output: {
      isError: false,
      returnvalue: moment().utc().format('YYYYMMDDhhmm').toString(),
    },
  },
  {
    description: '正常ケース デフォルト',
    input: [
    ],
    output: {
      isError: false,
    },
  },
];
module.exports.getCurrentTimestampData = [
  {
    description: '正常ケース YYYYMMDD',
    input: [
    ],
    output: {
      isError: false,
      returnvalue: moment().utc(),
    },
  },
];
module.exports.db2timestampFormatForUIData = [
  {
    description: '正常ケース',
    input: [
      '2019-03-27-02.50.32.150969',
    ],
    output: {
      isError: false,
      returnvalue: '2019-03-27 02:50:32',
    },
  },
  {
    description: '正常ケース 入力なし',
    input: [
    ],
    output: {
      isError: false,
      returnvalue: '',
    },
  },
  {
    description: '異常ケース、日付ではありません',
    input: [
      '2019-03-32-02.50.32.150969',
    ],
    output: {
      isError: true,
      errMsg: '2019-03-32-02.50.32.150969が日付形式ではありません',
    },
  },
];