const uuidv4 = require('uuid/v4');
const { bizProcess } = require('./bizProcess');
const { log } = require('../util/log');

// 调用参数
const testdata = {
  userid: 'testuser',
  password: '12345',
  username: 'testusername',
};

// 调用业务处理
bizProcess(uuidv4(), testdata)
  .then(result => log.info(result))
  .catch(error => log.error(error));
