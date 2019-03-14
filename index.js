const ibmdb = require('ibm_db');
const uuidv4 = require('uuid/v4');
const { log } = require('./util/log');
const { DB2Error } = require('./UserDefineError/db2Error');
const { DataError } = require('./UserDefineError/dataError');
const util = require('./util/commonUtil');
const constdata = require('./util/constdata');

class Database {
  constructor(connectstr, uuid) {
    this.db2conn = ibmdb.openSync(connectstr);
    this.transaction = false;
    this.uuid = uuid || uuidv4();
  }

  beginTransaction() {
    return new Promise((resolve, reject) => {
      log.info(this.uuid, 'transaction開始');
      this.db2conn.beginTransaction((err) => {
        if (err) {
          return reject(new DB2Error('beginTransaction', err, this));
        }
        this.transaction = true;
        return resolve();
      });
    });
  }

  async insertByData(table, data) {
    log.info(this.uuid, 'insertByData', table, data);
    let insertresult;
    if (data.length === 0) {
      throw new DataError(`insertByData for Table(${table}) with no data`);
    }
    if (data instanceof Array) {
      const fieldnames = Object.keys(data[0]);
      const sqlfields = fieldnames.join(',');
      const sqlvalues = data.map((singlerec) => {
        const singlevalues = fieldnames.map(fieldname => `'${singlerec[fieldname]}'`);
        return `(${singlevalues.join(',')})`;
      });
      const sqlvaluesstring = sqlvalues.join(',');
      const sql = `select * from FINAL TABLE(insert into ${table} (${sqlfields}) values ${sqlvaluesstring})`;
      insertresult = await this.executeSql(sql);
    } else {
      const fieldnames = Object.keys(data);
      const sqlfields = fieldnames.join(',');
      const sqlvalues = '? ,'.repeat(fieldnames.length).slice(0, -1);
      const sql = `select * from FINAL TABLE(insert into ${table} (${sqlfields}) values (${sqlvalues}))`;
      const sqlparam = fieldnames.map(field => data[field]);
      insertresult = await this.executeSql(sql, sqlparam);
    }
    return data instanceof Array ? insertresult : insertresult[0];
  }

  async selectByKey(table, key) {
    log.info(this.uuid, 'selectByKey', table, key);
    const result = await this.selectByCondition(table, key);
    if (result.length !== 1) {
      throw new DataError(`selectByKey for Table(${table}) with condition ${JSON.stringify(key)} got ${result.length} record, responsdata can be found in errordata field`, result );
    }
    return result[0];
  }

  async deleteByKey(table, key) {
    log.info(this.uuid, 'selectByKey', table, key);
    this.executeSql('a', 'b');
    return '';
  }

  async updateByKey(table, key) {
    this.executeSql('a', 'b');
    return '';
  }

  async selectByCondition(table, condition, orderkeys, ifLock) {
    log.info(this.uuid, 'selectByCondition');
    log.info(table, condition, orderkeys, ifLock);
    const ordersql = orderkeys instanceof Array ? util.filedsarray2Order(orderkeys) : '';
    const localIfLock = orderkeys instanceof Array ? ifLock : orderkeys;
    const locksql = localIfLock ? constdata.sqlLockString : '';
    log.info(this.uuid, 'selectByCondition', table, condition);
    const preparedata = util.data2Where(condition);
    const sql = `select * FROM ${table} ${preparedata.wherecondition} ${ordersql} ${locksql}`;
    const result = await this.executeSql(sql, preparedata.sqlparam);
    log.info(result);
    return preparedata ? result : [];
  }

  async updateByCondition(table, setkey, condition) {
    log.info(this.uuid, 'updateByCondition', setkey, condition);
    this.executeSql('a', 'b');
    return '';
  }

  // 删除talbe中符合condition对象条件的数据
  // 如{a:1 , b:2} => where a=1 and b=2
  async deleteByCondition(table, condition) {
    log.info(this.uuid, 'deleteByCondition', table, condition);
    const preparedata = util.data2Where(condition);
    log.info(preparedata);
    const sql = `delete FROM ${table} ${preparedata.sqlwhere}`;
    const result = await this.executeSql(sql, preparedata.sqlparam);
    return preparedata ? result : [];
  }

  executeSql(sql, data) {
    return new Promise((resolve, reject) => {
      const params = data || [];
      log.info(this.uuid, 'sql:', sql, 'params:', params);
      this.db2conn.query(sql, params, (error, rows, sqlca) => {
        log.info(this.uuid, sqlca);
        if (error) {
          return reject(new DB2Error('executeSql', error, this, sql, data));
        }
        return resolve(rows);
      });
    });
  }

  rollBack() {
    return new Promise((resolve, reject) => {
      log.info(this.uuid, 'rollBack');
      this.db2conn.rollbackTransaction((error) => {
        if (error) {
          return reject(new DB2Error('rollBack', error, this));
        }
        return resolve('');
      });
    });
  }

  commitTransaction() {
    return new Promise((resolve, reject) => {
      if (!this.transaction) {
        log.info(this.uuid, 'no transcation found, just close the connection');
        this.db2conn.close((closeerr) => {
          if (closeerr) {
            return reject(new DB2Error('commitTransaction', closeerr));
          }
          return resolve('');
        });
      }
      log.info(this.uuid, 'commit開始');
      this.db2conn.commitTransaction((err) => {
        if (err) {
          return reject(new DB2Error('commitTransaction', err));
        }
        log.error(err);
        log.info('close db2 connection');
        this.db2conn.close((closeerr) => {
          if (closeerr) {
            return reject(new DB2Error('commitTransaction', closeerr));
          }
          return resolve('');
        });
        return resolve('');
      });
    });
  }
}
module.exports = Database;
