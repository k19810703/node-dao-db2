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

  // 内置方法不够用咋整，不要慌，你可以自己定义接口
  function custormizeMethod() {

  };
}
```

然后就可以开始开发你的业务处理了
``` javascript
const { Database } = require('@cic-digital/node-dao-db2');
const { People } = require('./People');

async function mybizprocess(){
  // 数据库连接串，可以定义在环境变量
  const DB2CONNECTSTRING = 'db2 connect string';
  // 创建数据库实例
  const database = new Database(DB2CONNECTSTRING);
  // 创建people实例
  const people = new People(database);
  // 如果需要transaction，开始transaction
  await database.beginTransaction();
  // 创建张三记录
  const zhansan = await people.create({NAME: '张三', AGE: 12});
  // 创建李四记录
  const lisi = await people.create({NAME: '李四', AGE: 21});
  // 删除id=2
  await people.delete({ID: 2});
  // 如果有transaction，提交transaction
  await database.commitTransaction();
}
```
默认情况下没有日志输出在console，如果你希望有日志，请设置环境变量LogLevel=Debug

内置方法使用说明