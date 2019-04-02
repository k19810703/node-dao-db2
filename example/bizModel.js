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
}

module.exports.User = User;
