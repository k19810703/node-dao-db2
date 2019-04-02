const uuidv4 = require('uuid/v4');
const { bizProcess } = require('./bizProcess');
const { log } = require('../util/log');

const testdata = {
  userid: 'testuser',
  password: '12345',
  username: 'testusername',
};
bizProcess(uuidv4(), testdata)
  .then(result => log.info(result))
  .catch(error => log.error(error));
