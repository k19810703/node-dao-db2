const uuidv4 = require('uuid/v4');
const Database = require('./database');
const { log } = require('./util/log');

function transaction(fun) {
  async function tmpfun(...args) {
    let uuid;
    let restargs = [];
    if (typeof args[0] === 'string' && args[0].length === 36) {
      [uuid, ...restargs] = args;
    } else {
      restargs = args;
      uuid = uuidv4();
    }
    let result;
    const database = new Database(uuid);
    try {
      // arguments.push(database);
      await database.beginTransaction();
      result = await fun(database, uuid, ...restargs);
      await database.commitTransaction().catch(commiterror => log.error(commiterror));
    } catch (error) {
      await database.rollBack().catch(rollbackerror => log.error(rollbackerror));
      result = Promise.reject(error);
    } finally {
      await database.closeDB();
    }
    return result;
  }
  return tmpfun;
}

module.exports.transaction = transaction;
