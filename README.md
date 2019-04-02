# node-db2数据访问组件

##  node-db2数据访问组件,方便用户快速构建db2数据库访问模块,提高程序的可读性

### 用法

####  install
```
npm install --save @cic-digital/node-dao-db2
```
####  QuickStart
这里的example可以在example目录下找到

Step1 创建业务模型，比如我们需要一个模型：用户，有如下的ddl
```
CREATE TABLE user (
   userid    VARCHAR(100) NOT NULL,
   password  VARCHAR(50) NOT NULL,
   username  VARCHAR(200) NOT NULL,
   userlevel CHAR(1) NOT NULL,
   updatetimestamp TIMESTAMP NOT NULL GENERATED ALWAYS FOR EACH ROW ON UPDATE AS ROW CHANGE TIMESTAMP,
   PRIMARY KEY (userid));
```

Step2 根据业务模型，创建对应的数据模型(bizModel.js)

``` javascript
// 引入schema配置包
const Joi = require('joi');
// 引入数据模型基础类
const { DataModel } = require('../dataModel');

// 创建用户类继续基础模型
class User extends DataModel {
  constructor(database) {
    super(database);
    // 根据ddl创建schema
    this.fullschema = {
      USERID: Joi.string().max(100).required(),
      PASSWORD: Joi.string().max(50).required(),
      USERNAME: Joi.string().max(50).required(),
      USERLEVEL: Joi.string().valid('0', '1', '2', '3'),
      UPDATETIMESTAMP: Joi.string(),
    };
    // 指定主key
    this.keyfieldlist = ['USERID'];
    // 指定数据库设定字段
    this.autosetlist = ['UPDATETIMESTAMP'];
    // 指定表名
    this.tablename = 'USER';
  }

  // 复杂处理可以自行定义方法
  async mycustomfunction() {
    const sql = `select * from ${this.tablename} where USERID = ?`;
    const result = await this.database.executeSql(sql, ['userid']);
    return result;
  }
}

module.exports.User = User;
```
[schema定义方法参考](https://github.com/hapijs/joi)

Step3 创建业务处理(bizProcess.js)

``` javascript
const { transaction } = require('../index');
const { log } = require('../util/log');
const { User } = require('./bizModel');
const { Where } = require('../index');

async function bizProcess(database, uuid, data) {
  log.info(uuid, 'bizProcess start');
  const user = new User(database);
  // 设定用户记录信息
  const newuser = {
    USERID: data.userid,
    PASSWORD: data.password,
    USERNAME: data.username,
    USERLEVEL: '1',
  };
  // 创建用户的记录
  const newuserdata = await user.create(newuser);
  log.info('newuserdata', newuserdata);
  // 设置检索key, 本例为 USERLEVEL >0 AND USERLEVEL < 10
  const usersearchkey = {
    USERLEVEL: Where.base().greater(0).less(10),
  };
  // 根据检索条件搜索数据库获得返回结果
  const searchresult = await user.retrieve(usersearchkey);
  log.info(uuid, 'searchresult', searchresult);
  log.info(uuid, 'bizProcess normal end');
  return searchresult;
}

// 申明业务处理需要transaction
module.exports.bizProcess = transaction(bizProcess);
```

类似retrieve， create等等内置方法使用说明 [参考API文档](https://github.com/hapijs/joi)
