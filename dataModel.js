const _ = require('lodash');

const { log } = require('./util/log');
const util = require('./util/commonUtil');
const { DataError } = require('./UserDefineError/dataError');

function commonCheck(model) {
  if (!model.schema) {
    throw new DataError('未定义schema，请在构造函数添加"this.schema = {yourtableschema};"中指定本模型的schema，schema指定方法参考https://github.com/hapijs/joi')
  }
  if (!model.tablename) {
    throw new DataError('表名未定义，请在构造函数"this.tablename = {yourtablename};"');
  }
  if (!model.primarykeys) {
    throw new DataError('主key字段名未定义，请在构造函数"this.primarykeys = [key1,key2];"');
  }
  if (!model.autosetfields) {
    throw new DataError('数据设置字段名(自增id等)未定义，请在构造函数"this.autosetfields = [key1,key2];"');
  }
}

function getFieldlist(schema) {
  return Object.keys(schema);
}

function getFieldlistWithOutAutoSet(schema, autosetfields) {
  const fieldlist = getFieldlist(schema);
  const result = _.difference(fieldlist, autosetfields);
  return result;
}

class DataModel {
  constructor(database) {
    this.database = database;
  }

  // 增
  async create(data) {
    commonCheck(this);
    const fieldsForCreate = getFieldlistWithOutAutoSet(data, this.autosetfields);
    const result = await this.database.insertByData(
      this.tablename,
      util.getFieldsFromObject(data, fieldsForCreate),
    );
    return result;
  }

  // async bulkCreate(data) {
  // }
  // 删
  // async delete(data) {

  // }

  // async bulkDelete(datas) {
    
  // }
  // 改
  // async update(data) {

  // };

  // async bulkUpdate(data) {

  // };


  // 查
  async retrieveAll() {
    const result = await this.database.selectByCondition(this.tablename, {});
    return result;
  }

  async retrieve(data) {
    commonCheck(this);
    const fieldlist = getFieldlist(this.schema);
    log.info(fieldlist);
    const condition = util.getFieldsFromObject(data, fieldlist);
    if (!condition) {
      return [];
    }
    log.debug(condition);
    const result = await this.database.selectByCondition(
      this.tablename,
      condition,
    );
    return result;
  }

  // async retrieveAllCount() {

  // }

  // async retrieveCount() {
    
  // }
}
module.exports = DataModel;
