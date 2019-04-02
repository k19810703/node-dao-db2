const { transaction } = require('../index');
const { log } = require('../util/log');
const { User } = require('./bizModel');
const { Where } = require('../index');
const { Order } = require('../index');

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
  const searchresult = await user.retrieve(usersearchkey, Order.base().asc('USERID').desc('USERLEVEL'));
  log.info(uuid, 'searchresult', searchresult);
  log.info(uuid, 'bizProcess normal end');
  return searchresult;
}

// 申明业务处理需要transaction
module.exports.bizProcess = transaction(bizProcess);
