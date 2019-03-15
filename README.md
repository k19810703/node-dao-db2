# node-db2数据访问组件

##  node-db2数据访问组件,方便用户快速构建db2数据库访问模块,提高程序的可读性

### 用法

####  install
```
npm install --save @cic-digital/node-dao-db2
```
####  QuickStart
创建业务模型，比如我们需要一个模型：人，有2个属性，名字和年龄

[schema定义方法参考](https://github.com/hapijs/joi)
``` javascript
const Joi = require('joi');

const { DataModel } = require('@cic-digital/node-dao-db2');
class People extends DataModel {
  constructor(database) {
    super(database);
    // 定义模型的schema
    this.schema = {
      ID: Joi.number().required(),
      NAME: Joi.string().required(),
      AGE: Joi.number().required(),
    };
    // 定义模型的表名
    this.tablename = 'PRODUCTTEST';
    // 表的主key，字符型数组，不分先后
    this.primarykeys = ['ID'];
    // 表的自动设置字段名(比如id，timestamp)，字符型数组，不分先后
    this.autosetfields = ['ID'];
  }
}
```

然后就可以开始开发你的业务处理了
``` javascript
const { Database } = require('@cic-digital/node-dao-db2');
const { People } = require('./People');

async function mybizprocess(){
  const DB2CONNECTSTRING = 'db2 connect string';
  const database = new Database(DB2CONNECTSTRING);
  const people = new People(database);
  await database.beginTransaction();
  const zhansan = await people.create({NAME: 'ZHANGSAN', AGE: 12});
  const lisi = await people.create({NAME: 'LISI', AGE: 21});
  await people.delete({ID: 2});
  await database.commitTransaction();

}
```
默认情况下没有日志输出在console，如果你希望有日志，请设置环境变量LogLevel=Debug