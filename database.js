const ibmdb = require('ibm_db');
const uuidv4 = require('uuid/v4');
const { log } = require('./util/log');

const {
  DB2DATABASE,
  DB2HOSTNAME,
  DB2UID,
  DB2PWD,
  DB2PORT,
} = process.env;

const DB2CONNECTSTRING = `DATABASE=${DB2DATABASE};HOSTNAME=${DB2HOSTNAME};UID=${DB2UID};PWD=${DB2PWD};PORT=${DB2PORT};PROTOCOL=TCPIP`;

class Database {
  constructor(uuid) {
    this.db2conn = ibmdb.openSync(DB2CONNECTSTRING);
    this.transaction = false;
    this.uuid = uuid || uuidv4();
  }

  async reConnectIfClose() {
    if (!this.db2conn.connected) {
      this.db2conn = await ibmdb.openSync(DB2CONNECTSTRING);
    }
  }

  async clearData(tableName) {
    await this.reConnectIfClose();
    const sql = `DELETE FROM ${tableName}`;
    await this.executeSql(sql, []);
  }

  async beginTransaction() {
    await this.reConnectIfClose();
    await this.db2conn.beginTransactionSync();
  }

  async executeSql(sql, data) {
    try {
      await this.reConnectIfClose();
      const params = data || [];
      log.info(this.uuid, 'sql : ', sql);
      log.info(this.uuid, 'data : ', JSON.stringify(params));
      const result = await this.db2conn.querySync(sql, params);
      return result;
    } catch (error) {
      log.error(this.uuid, 'executeSql error', error);
      if (this.transaction) {
        log.info(this.uuid, 'rollback transcation');
        await this.db2conn.rollbackTransactionSync();
      }
      throw error;
    }
  }

  async executeNonQuery(sql, data) {
    let result;
    let resultdata;
    let stmt;
    try {
      await this.reConnectIfClose();
      stmt = this.db2conn.prepareSync(sql);
      result = await stmt.executeSync(data);
      resultdata = result.fetchAllSync({ fetchMode: 3 }); // Fetch data in Array mode.
      return resultdata;
    } catch (error) {
      log.error(this.uuid, 'executeNonQuery:', error);
      await this.db2conn.rollbackTransactionSync().catch(rberror => log.error(rberror));
      throw error;
    } finally {
      await result.closeSync();
      await stmt.closeSync();
    }
  }

  async rollBack() {
    log.info(this.uuid, 'rollback開始');
    await this.db2conn.rollbackTransactionSync();
  }

  async closeDB() {
    log.info(this.uuid, 'close db2 connection');
    try {
      await this.db2conn.closeSync();
    } catch (err) {
      log.error(this.uuid, 'close db2 connection error', err);
    }
    log.info(this.uuid, 'close db2 connection end');
  }

  async commitTransaction() {
    try {
      await this.reConnectIfClose();
      log.info(this.uuid, 'commit transcation');
      await this.db2conn.commitTransactionSync();
      log.info(this.uuid, 'commit db2 connection');
    } catch (err) {
      log.info(this.uuid, `commit error: ${err}`);
      throw err;
    }
  }
}
module.exports = Database;
