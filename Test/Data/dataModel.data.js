/* eslint-env jest */
const Joi = require('joi');
const { DataModel } = require('../../dataModel');
const Database = require('../../database');
const { Order } = require('../../index');
const { Where } = require('../../index');

const {
  dummyResponse,
  dummyArrayResponse,
  dummyArrayResponseWith1Element,
  dummyArrayResponseEmpty,
} = require('./commondata');

jest.mock('../../database');

class Model1 extends DataModel {
}

class Model2 extends DataModel {
  constructor(database) {
    super(database);
    this.fullschema = { a: 1 };
    this.insertschema = { b: 2 };
    this.keyfieldlist = ['3', '4'];
    this.autosetlist = ['1', '2'];
    this.tablename = 'testtable';
  }
}

class Model3 extends DataModel {
  constructor(database) {
    super(database);
    this.fullschema = { a: 1 };
    this.insertschema = this.fullschema;
    this.keyfieldlist = ['ORDER_NO', 'SPLIT_FILENAME'];
    this.autosetlist = 'CHANGE_TS';
    this.tablename = 'FILE_STATUS_T';
  }
}

class Model4 extends DataModel {
  constructor(database) {
    super(database);
    this.fullschema = { a: 1 };
    this.insertschema = this.fullschema;
    this.keyfieldlist = 'ORDER_NO';
    this.autosetlist = ['CHANGE_TS'];
    this.tablename = 'FILE_STATUS_T';
  }
}

class Model5 extends DataModel {
  constructor(database) {
    super(database);
    this.fullschema = {
      a: Joi.number().required(),
      b: Joi.string(),
      c: Joi.string().required(),
      d: Joi.string().required(),
      e: Joi.string().required(),
      f: Joi.string().required(),
      g: Joi.string().required(),
      h: Joi.string().required(),
    };
    this.insertschema = this.fullschema;
    this.keyfieldlist = ['a'];
    this.autosetlist = ['b'];
    this.tablename = 'Model5Table';
  }
}
module.exports.constructorData = [
  {
    description: '正常case',
    BizModel: Model1,
    database: new Database(),
    output: {
      isError: false,
    },
  },
  {
    description: '异常case: 参数非Database类型',
    BizModel: Model1,
    database: 'aaa',
    output: {
      isError: true,
      errMsg: '请使用database的实例作为参数来构造数据模型',
    },
  },
];
module.exports.commonCheckData = [
  {
    description: '异常case　fullschema未定义',
    initialize: {
      BizModel: Model2,
      database: new Database(),
      propToeRemoved: 'fullschema',
    },
    output: {
      isError: true,
      errMsg: '未指定schema',
    },
  },
  {
    description: '异常case　fullschema未定义',
    initialize: {
      BizModel: Model2,
      database: new Database(),
      propToeRemoved: 'tablename',
    },
    output: {
      isError: true,
      errMsg: '表名(tablename)未指定',
    },
  },
  {
    description: '异常case　自动设定字段列表未指定',
    initialize: {
      BizModel: Model2,
      database: new Database(),
      propToeRemoved: 'autosetlist',
    },
    output: {
      isError: true,
      errMsg: '自动设定字段列表未指定',
    },
  },
  {
    description: '异常case　主key项目未指定',
    initialize: {
      BizModel: Model2,
      database: new Database(),
      propToeRemoved: 'keyfieldlist',
    },
    output: {
      isError: true,
      errMsg: '主key项目未指定',
    },
  },
  {
    description: '异常case　自动设定字段列表非数组类型',
    initialize: {
      BizModel: Model3,
      database: new Database(),
      propToeRemoved: '',
    },
    output: {
      isError: true,
      errMsg: '自动设定字段列表非数组类型',
    },
  },
  {
    description: '异常case　主key项目非数组类型',
    initialize: {
      BizModel: Model4,
      database: new Database(),
      propToeRemoved: '',
    },
    output: {
      isError: true,
      errMsg: '主key项目非数组类型',
    },
  },
];
module.exports.getfunctionData = [
  {
    description: '正常case',
    initialize: {
      BizModel: Model2,
      database: new Database(),
    },
    output: {
      isError: false,
    },
  },
];
module.exports.retrieveAllData = [
  {
    description: '正常case：无排序参数',
    initialize: {
      BizModel: Model2,
      executeSql: async () => Promise.resolve(dummyResponse),
    },
    input: [
    ],
    check: {
      isError: false,
      returnvalue: dummyResponse,
    },
    executeSqlMock: {
      isCalled: true,
      expectParam: [
        'select * from testtable ',
      ],
    },
  },
  {
    description: '正常case：单个排序字段',
    initialize: {
      BizModel: Model2,
      executeSql: async () => Promise.resolve(dummyResponse),
    },
    input: [
      Order.base().asc('a'),
    ],
    check: {
      isError: false,
      returnvalue: dummyResponse,
    },
    executeSqlMock: {
      isCalled: true,
      expectParam: [
        'select * from testtable  order by a ',
      ],
    },
  },
  {
    description: '正常case：多个排序字段',
    initialize: {
      BizModel: Model2,
      executeSql: async () => Promise.resolve(dummyResponse),
    },
    input: [
      Order.base().desc('a').asc('b'),
    ],
    check: {
      isError: false,
      returnvalue: dummyResponse,
    },
    executeSqlMock: {
      isCalled: true,
      expectParam: [
        'select * from testtable  order by a desc,b ',
      ],
    },
  },
  {
    description: '异常case: 参数非Order类型',
    initialize: {
      BizModel: Model2,
      executeSql: async () => Promise.resolve(dummyResponse),
    },
    input: [
      {
        aa: 1,
      },
    ],
    check: {
      isError: true,
      errMsg: 'retrieveAll的参数必须是Order对象的实例',
    },
    executeSqlMock: {
      isCalled: false,
    },
  },
];
module.exports.retrieveData = [
  {
    description: '正常case: 仅传入数据模型',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
    ],
    output: {
      isError: false,
      executeSqlParam1: 'select * from Model5Table  where  a = ?  and  b = ?  and  c = ?      ',
      executeSqlParam2: [1, 'bkey', 'ckey'],
    },
  },
  {
    description: '正常case: 传入数据模型和件数',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      2,
    ],
    output: {
      isError: false,
      executeSqlParam1: 'select * from Model5Table  where  a = ?  and  b = ?  and  c = ?    fetch first 2 rows only  ',
      executeSqlParam2: [1, 'bkey', 'ckey'],
    },
  },
  {
    description: '正常case: 传入数据模型和排序',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      Order.base().asc('a').desc('b'),
    ],
    output: {
      isError: false,
      executeSqlParam1: 'select * from Model5Table  where  a = ?  and  b = ?  and  c = ?    order by a,b desc    ',
      executeSqlParam2: [1, 'bkey', 'ckey'],
    },
  },
  {
    description: '正常case: 传入数据模型和锁',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      true,
    ],
    output: {
      isError: false,
      executeSqlParam1: 'select * from Model5Table  where  a = ?  and  b = ?  and  c = ?       FOR UPDATE WITH  CS',
      executeSqlParam2: [1, 'bkey', 'ckey'],
    },
  },
  {
    description: '正常case: 传入数据模型，件数，排序',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      2,
      Order.base().asc('a').desc('c'),
    ],
    output: {
      isError: false,
      executeSqlParam1: 'select * from Model5Table  where  a = ?  and  b = ?  and  c = ?    order by a,c desc  fetch first 2 rows only  ',
      executeSqlParam2: [1, 'bkey', 'ckey'],
    },
  },
  {
    description: '正常case: 传入数据模型，件数，锁',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      2,
      true,
    ],
    output: {
      isError: false,
      executeSqlParam1: 'select * from Model5Table  where  a = ?  and  b = ?  and  c = ?    fetch first 2 rows only   FOR UPDATE WITH  CS',
      executeSqlParam2: [1, 'bkey', 'ckey'],
    },
  },
  {
    description: '正常case: 传入数据模型，排序，锁',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      Order.base().asc('a').desc('c'),
      true,
    ],
    output: {
      isError: false,
      executeSqlParam1: 'select * from Model5Table  where  a = ?  and  b = ?  and  c = ?    order by a,c desc     FOR UPDATE WITH  CS',
      executeSqlParam2: [1, 'bkey', 'ckey'],
    },
  },
  {
    description: '正常case: 传入数据模型，件数,排序，锁',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      2,
      Order.base().asc('a').desc('c'),
      true,
      'a',
    ],
    output: {
      isError: false,
      executeSqlParam1: 'select * from Model5Table  where  a = ?  and  b = ?  and  c = ?    order by a,c desc  fetch first 2 rows only   FOR UPDATE WITH  CS',
      executeSqlParam2: [1, 'bkey', 'ckey'],
    },
  },
  {
    description: '异常case 不传入参数',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
    ],
    output: {
      isError: true,
      errMsg: '参数异常',
    },
  },
  {
    description: '异常case 传入参数但不包含数据库库字段',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        x: 'a',
      },
    ],
    output: {
      isError: true,
      errMsg: 'where条件未指定(data模型中不包含表字段),请使用retrieveAll方法',
    },
  },
];
module.exports.retrieveOneData = [
  {
    description: '正常case',
    initialize: {
      BizModel: Model5,
      retrieve: async () => Promise.resolve(dummyArrayResponseWith1Element),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      2,
      ['a', 'c'],
      true,
    ],
    output: {
      isError: false,
    },
  },
  {
    description: '异常case: 未找到记录',
    initialize: {
      BizModel: Model5,
      retrieve: async () => Promise.resolve(dummyArrayResponseEmpty),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      2,
      ['a', 'c'],
      true,
    ],
    output: {
      isError: true,
      errMsg: 'Model5Table没有找到满足条件的记录',
    },
  },
  {
    description: '异常case: 找到多条',
    initialize: {
      BizModel: Model5,
      retrieve: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
      2,
      ['a', 'c'],
      true,
    ],
    output: {
      isError: true,
      errMsg: 'Model5Table找到2条记录，如果预想会找到多条记录，请使用retrieve',
    },
  },
];
module.exports.retrieveCountData = [
  {
    description: '正常case(包含数字，字符，Condition的各种类型(like,>,>=,<,<=)',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve([{ COUNT: 123 }]),
    },
    input: [
      {
        a: 1,
        b: 'abc',
        c: Where.base().like('a%c'),
        d: Where.base().greater('a'),
        e: Where.base().greaterequal('b'),
        f: Where.base().less('e'),
        g: Where.base().lessequal('f'),
        h: Where.base().greater(0).lessequal(99),
      },
    ],
    output: {
      isError: false,
      resultvalue: 123,
      executeSqlCall: {
        param1: 'select count(*) as COUNT from Model5Table  where  a = ?  and  b = ?  and  c like ?  and  d > ?  and  e >= ?  and  f < ?  and  g <= ?  and  h > ?  and  h <= ?   ',
        param2: [1, 'abc', 'a%c', 'a', 'b', 'e', 'f', 0, 99],
      },
    },
  },
  {
    description: '正常case 无参数',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve([{ COUNT: 123 }]),
    },
    input: [
    ],
    output: {
      isError: false,
      resultvalue: 123,
      executeSqlCall: {
        param1: 'select count(*) as COUNT from Model5Table  ',
        param2: [],
      },
    },
  },
  {
    description: '异常case: 有参数，但是不包含表的字段',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve([{ COUNT: 123 }]),
    },
    input: [
      {
        x: 'aaa',
      },
    ],
    output: {
      isError: true,
      errMsg: '未指定where条件，如不希望指定where条件，请不要传入参数',
    },
  },
];
module.exports.createData = [
  {
    description: '正常case',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponseWith1Element),
    },
    input: [
      {
        a: 1,
        b: 'bdata',
        c: 'cdata',
        d: 'ddata',
        e: 'edata',
        f: 'fdata',
        g: 'gdata',
        h: 'hdata',
      },
    ],
    output: {
      isError: false,
      resultvalue: dummyArrayResponseWith1Element,
      executeSqlParam1: 'select * from final table(insert into Model5Table (a , c , d , e , f , g , h) values (? , ? , ? , ? , ? , ? , ?))',
      executeSqlParam2: [1, 'cdata', 'ddata', 'edata', 'fdata', 'gdata', 'hdata'],
    },
  },
  {
    description: '异常case:参数为数组类型',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponseWith1Element),
    },
    input: [
      [
        {
        },
        {
        },
      ],
    ],
    output: {
      isError: true,
      errMsg: '参数为数组类型，如需要创建多条，请使用bulkCreate',
    },
  },
];
module.exports.bulkCreateData = [
  {
    description: '正常case',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      [
        {
          a: 1,
          b: 'bdata',
          c: 'cdata',
          d: 'ddata',
          e: 'edata',
          f: 'fdata',
          g: 'gdata',
          h: 'hdata',
        },
        {
          a: 2,
          b: 'bdata',
          c: 'cdata',
          d: 'ddata',
          e: 'edata',
          f: 'fdata',
          g: 'gdata',
          h: 'hdata',
        },
      ],
    ],
    output: {
      isError: false,
      isCalled: true,
      resultvalue: dummyArrayResponse,
      executeSqlParam1: 'Insert into Model5Table (a,c,d,e,f,g,h) values (\'1\',\'cdata\',\'ddata\',\'edata\',\'fdata\',\'gdata\',\'hdata\'),(\'2\',\'cdata\',\'ddata\',\'edata\',\'fdata\',\'gdata\',\'hdata\')',
      executeSqlParam2: [],

    },
  },
  {
    description: '正常case 传入空数组',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve([]),
    },
    input: [
      [
      ],
    ],
    output: {
      isError: false,
      isCalled: false,
      resultvalue: [],
    },
  },
  {
    description: '异常case: 参数非数组',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
    ],
    output: {
      isError: true,
      isCalled: false,
      errMsg: '参数不是数组类型，如果希望创建单条记录，请使用create方法',
    },
  },
];
module.exports.updateByKeyData = [
  {
    description: '正常case',
    initialize: {
      BizModel: Model5,
      updateByCondition: async () => Promise.resolve(dummyArrayResponseWith1Element),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
    ],
    output: {
      isError: false,
      resultvalue: dummyArrayResponseWith1Element[0],
      updateByCondition: {
        param1: { a: 1 },
        param2: { c: 'ckey' },
      },
    },
  },
  {
    description: '异常case: 更新对象数据不存在',
    initialize: {
      BizModel: Model5,
      updateByCondition: async () => Promise.resolve([]),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
    ],
    output: {
      isError: true,
      resultvalue: dummyArrayResponseWith1Element[0],
      errMsg: 'Model5Table的0条数据被更新(非事务模式下已经更新成功)、非主key条件的更新请用updateByCondition',
      updateByCondition: {
        param1: { a: 1 },
        param2: { c: 'ckey' },
      },
    },
  },
  {
    description: '异常case: 数据模型未包含主key项目',
    initialize: {
      BizModel: Model5,
      updateByCondition: async () => Promise.resolve([]),
    },
    input: [
      {
        b: 'bkey',
        c: 'ckey',
      },
    ],
    output: {
      isError: true,
      errMsg: '主key字段a不存在',
    },
  },
];
module.exports.updateByConditionData = [
  {
    description: '正常case',
    initialize: {
      BizModel: Model5,
      executeSql: async () => Promise.resolve(dummyArrayResponse),
    },
    input: [
      {
        a: 1,
        b: Where.base().greater(10),
      },
      {
        b: 'bkey',
        c: 'ckey',
      },
    ],
    output: {
      isError: false,
      resultvalue: dummyArrayResponse,
      executeSqlParam1: 'select * from FINAL TABLE(update Model5Table  set b = ? , c = ?   where  a = ?  and  b > ?  )',
      executeSqlParam2: ['bkey', 'ckey', 1, 10],
    },
  },
];
module.exports.deleteByKeyData = [
  {
    description: '正常case',
    initialize: {
      BizModel: Model5,
      executeNonQuery: async () => Promise.resolve(),
    },
    input: [
      {
        a: 1,
        b: 'bkey',
        c: 'ckey',
      },
    ],
    output: {
      isError: false,
      resultvalue: [],
      executeNonQuery: {
        param1: 'delete Model5Table  where  a = ?  ',
        param2: [1],
      },
    },
  },
  {
    description: '异常case: 主key项目不存在',
    initialize: {
      BizModel: Model5,
      executeNonQuery: async () => Promise.resolve([]),
    },
    input: [
      {
        b: 'bkey',
        c: 'ckey',
      },
    ],
    output: {
      isError: true,
      errMsg: '主key字段a不存在',
    },
  },
];
module.exports.deleteByConditionData = [
  {
    description: '正常case',
    initialize: {
      BizModel: Model5,
      executeNonQuery: async () => Promise.resolve(),
    },
    input: [
      {
        a: 1,
        b: Where.base().greater(10),
      },
    ],
    output: {
      isError: false,
      executeNonQueryCall: {
        param1: 'delete Model5Table  where  a = ?  and  b > ?  ',
        param2: [1, 10],
      },
    },
  },
  {
    description: '异常case, 未包含有效条件',
    initialize: {
      BizModel: Model5,
      executeNonQuery: async () => Promise.resolve(),
    },
    input: [
      {
        x: 1,
        y: Where.base().greater(10),
      },
    ],
    output: {
      isError: true,
      errMsg: '数据模型中为含有条件，禁止无条件删除',
    },
  },
];
