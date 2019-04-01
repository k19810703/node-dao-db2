const _ = require('lodash');

const Database = require('./database');
const { UsageError } = require('./UserDefineError/unvalidUsage');
const { DefaultBizError } = require('./UserDefineError/DefaultBizError');
const util = require('./util/commonUtil');
const { StrictMode, sqlLockString } = require('./util/constdata');
const { log } = require('./util/log');
const { Order } = require('./index');

function getRetrieveParams(...args) {
  log.debug('getRetrieveParams', JSON.stringify(args));
  if (args.length === 0) {
    const errorMessage = '参数异常';
    log.error(this.uuid, 'retrieve方法错误', errorMessage, JSON.stringify(args));
    throw new UsageError(errorMessage, args);
  }
  let data = {};
  let count = 0;
  let order;
  let IfLock = false;
  args.forEach((arg, index) => {
    log.debug(arg, index, typeof arg);
    if (index === 0) {
      data = arg;
    } else if (typeof arg === 'number') {
      count = arg;
    } else if (arg instanceof Order) {
      order = arg;
    } else if (typeof arg === 'boolean') {
      IfLock = arg;
    }
  });
  const result = {
    data,
    count,
    order,
    IfLock,
  };
  log.debug('result', JSON.stringify(result));
  return result;
}

class DataModel {
  constructor(database) {
    if (database instanceof Database) {
      this.database = database;
      this.lockType = 'CS';
    } else {
      const errorMessage = '请使用database的实例作为参数来构造数据模型';
      log.error(this.uuid, '数据模型构造错', errorMessage);
      throw new UsageError(errorMessage);
    }
  }

  commonCheck() {
    // commoncheck
    if (!this.tablename) {
      throw new UsageError('表名(tablename)未指定');
    }
    if (!this.keyfieldlist) {
      throw new UsageError('主key项目未指定');
    }
    if (!(this.keyfieldlist instanceof Array)) {
      throw new UsageError('主key项目非数组类型');
    }
    if (!this.fullschema) {
      throw new UsageError('未指定schema');
    }
    if (!this.autosetlist) {
      throw new UsageError('自动设定字段列表未指定');
    }
    if (!(this.autosetlist instanceof Array)) {
      throw new UsageError('自动设定字段列表非数组类型');
    }
  }

  getAutoSetFieldList() {
    return this.autosetlist;
  }

  getKeyFieldList() {
    return this.keyfieldlist;
  }

  getFullSchema() {
    return this.fullschema;
  }

  getFieldList() {
    return Object.keys(this.fullschema);
  }

  async retrieveAll(order) {
    this.commonCheck();
    let orderstring = '';
    if (order) {
      if (!(order instanceof Order)) {
        const errMsg = 'retrieveAll的参数必须是Order对象的实例';
        throw new UsageError(errMsg, order);
      } else {
        orderstring = order.ordersql();
      }
    }
    const sql = `select * from ${this.tablename} ${orderstring}`;
    const result = await this.database.executeSql(sql);
    return result;
  }

  async retrieveOne(...args) {
    const result = await this.retrieve(...args);
    log.info(this.uuid, 'retrieveOne result:', result);
    if (result.length === 0) {
      const errorMessage = `${this.tablename}没有找到满足条件的记录`;
      log.error('retrieveOne异常', errorMessage);
      throw new DefaultBizError(errorMessage, {
        searchkey: args[0],
      });
    }
    if (result.length !== 1) {
      const errorMessage = `${this.tablename}找到${result.length}条记录，如果预想会找到多条记录，请使用retrieve`;
      log.error('retrieveOne异常', errorMessage);
      throw new DefaultBizError(
        errorMessage,
        { searchkey: args[0] },
      );
    }
    return result[0];
  }

  async retrieveCount(data) {
    this.commonCheck();
    let sqlwhere;
    let sqlparam;
    if (data) {
      const fieldlist = this.getFieldList(this.getFullSchema());
      const condition = util.getFieldsFromObject(data, fieldlist);
      const wherecondition = await util.data2Where(condition);
      log.debug('wherecondition', wherecondition);
      ({ sqlwhere, sqlparam } = wherecondition);
      log.debug(sqlwhere);
      log.debug(sqlparam);
    } else {
      sqlwhere = '';
      sqlparam = [];
    }
    const sql = `select count(*) as COUNT from ${this.tablename} ${sqlwhere} `;
    const result = await this.database.executeSql(sql, sqlparam);
    return result[0].COUNT;
  }

  async retrieve(...args) {
    const {
      data, count, order, IfLock,
    } = getRetrieveParams(...args);
    this.commonCheck();
    const fieldlist = this.getFieldList(this.getFullSchema());
    const condition = util.getFieldsFromObject(data, fieldlist);
    if (Object.keys(condition).length === 0) {
      throw new UsageError('where条件未指定(data模型中不包含表字段),请使用retrieveAll方法', data);
    }
    const wherecondition = await util.data2Where(condition);
    const orderstring = order === undefined ? '' : order.ordersql();
    const lockstring = IfLock ? `${sqlLockString} ${this.lockType}` : '';
    const countstring = count === 0 ? '' : `fetch first ${count} rows only`;
    const sql = `select * from ${this.tablename} ${wherecondition.sqlwhere} ${orderstring} ${countstring}  ${lockstring}`;
    const result = await this.database.executeSql(sql, wherecondition.sqlparam);
    log.debug(this.uuid, 'retrieve result', JSON.stringify(result));
    return result;
  }

  async create(data) {
    log.debug(`create ${this.tablename}`, data);
    this.commonCheck();
    if (Array.isArray(data)) {
      const errorMessage = '参数为数组类型，如需要创建多条，请使用bulkCreate';
      log.error('createエラー', errorMessage);
      throw new UsageError(errorMessage);
    }
    const fieldlist = this.getFieldList();
    log.debug('fieldlist', fieldlist);
    const autoSetFiledList = this.getAutoSetFieldList();
    log.debug('autoSetFiledList', autoSetFiledList);
    const insertFiledList = _.difference(fieldlist, autoSetFiledList);
    log.debug('insertFiledList', insertFiledList);
    const insertObject = util.getFieldsFromObject(data, insertFiledList);
    log.debug('insertObject', insertObject);

    const insertCondition = await util.data2Insert(insertObject, this.getFullSchema());
    const sql = `select * from final table(insert into ${this.tablename} ${insertCondition.sql})`;
    const result = await this.database.executeSql(sql, insertCondition.sqlparam);
    return result;
  }

  async bulkCreate(datas) {
    this.commonCheck();
    if (!(datas instanceof Array)) {
      const errorMessage = '参数不是数组类型，如果希望创建单条记录，请使用create方法';
      log.error('create异常', errorMessage);
      throw new UsageError(errorMessage, datas);
    }

    if (datas.length === 0) {
      return [];
    }

    const fields = _.difference(Object.keys(datas[0]), this.getAutoSetFieldList());
    const fieldsstring = fields.join(',');
    log.debug('fieldstring', fieldsstring);

    const valuesstringarray = await Promise.all(datas.map(async (data) => {
      await util.inputcheck(data, this.getFullSchema(), true);
      const valuestring = fields.map(field => `'${data[field]}'`).join(',');
      return `(${valuestring})`;
    }));
    log.debug('valuesstringarray', valuesstringarray);
    const valuestring = valuesstringarray.join(',');
    log.debug('valuestring', valuestring);
    const sql = `Insert into ${this.tablename} (${fieldsstring}) values ${valuestring}`;
    const result = await this.database.executeSql(sql);
    return result;
  }

  async updateByKey(data) {
    this.commonCheck();
    const keyFiledList = this.getKeyFieldList();
    const fieldlist = this.getFieldList();
    const autoSetFiledList = this.getAutoSetFieldList();
    const keyData = await util.getFieldsFromObject(data, keyFiledList, StrictMode);
    const setFiledList = _.difference(_.difference(fieldlist, keyFiledList), autoSetFiledList);
    const setData = await util.getFieldsFromObject(data, setFiledList);
    const result = await this.updateByCondition(keyData, setData);
    if (result.length !== 1) {
      const errorMessage = `${this.tablename}的${result.length}条数据被更新(非事务模式下已经更新成功)、非主key条件的更新请用updateByCondition`;
      log.error(this.uuid, 'updateByKey异常', errorMessage);
      throw new UsageError(errorMessage, {
        updateObject: data,
      });
    }
    return result[0];
  }

  async updateByCondition(keydata, setdata) {
    log.debug('updateByCondition', 'key:', JSON.stringify(keydata), 'set:', JSON.stringify(setdata));
    this.commonCheck();
    const fieldlist = this.getFieldList();
    const condition = await util.getFieldsFromObject(keydata, fieldlist);
    const wherecondition = await util.data2Where(condition);
    const setObject = await util.data2Set(setdata, this.getFullSchema());
    const sql = `select * from FINAL TABLE(update ${this.tablename} ${setObject.sql} ${wherecondition.sqlwhere})`;
    const sqlparam = _.concat(setObject.sqlparam, wherecondition.sqlparam);
    const result = await this.database.executeSql(sql, sqlparam);
    return result;
  }

  async deleteByKey(condition) {
    this.commonCheck();
    const keyfields = this.getKeyFieldList();
    const keyobject = util.getFieldsFromObject(condition, keyfields, StrictMode);
    const wherecondition = await util.data2Where(keyobject);
    const sql = `delete ${this.tablename} ${wherecondition.sqlwhere}`;
    const result = await this.database.executeNonQuery(sql, wherecondition.sqlparam);
    return result;
  }

  async deleteByCondition(data) {
    this.commonCheck();
    const fieldlist = this.getFieldList();
    const condition = await util.getFieldsFromObject(data, fieldlist);
    if (Object.keys(condition).length === 0) {
      const errorMessage = '数据模型中为含有条件，禁止无条件删除';
      throw new UsageError(errorMessage, data);
    }
    const wherecondition = await util.data2Where(condition);
    const sql = `delete ${this.tablename} ${wherecondition.sqlwhere}`;
    const result = await this.database.executeNonQuery(sql, wherecondition.sqlparam);
    return result;
  }
}

module.exports.DataModel = DataModel;
