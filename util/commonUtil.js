const Joi = require('joi');
// const _ = require('lodash');
const moment = require('moment');
const { UsageError } = require('../UserDefineError/unvalidUsage');
const { DefaultBizError } = require('../UserDefineError/DefaultBizError');
const { DataError } = require('../UserDefineError/dataError');

const { Condition } = require('../index');

const { log } = require('./log');

async function inputcheck(data, schema, strictMode) {
  let allowUnknown;
  if (typeof strictMode !== 'boolean') {
    throw new UsageError('inputcheck的第三参数必须是boolean型', strictMode);
  }
  if (!strictMode) {
    allowUnknown = true;
  } else {
    allowUnknown = !strictMode;
  }
  const { error } = Joi.validate(data, schema, { allowUnknown });
  if (error) {
    log.debug(error);
    throw new DataError(error.message, data);
  }
}

function data2Where(data) {
  log.debug('data2Where input', JSON.stringify(data));
  let result;
  if (!data) {
    result = {
      sqlwhere: '',
      sqlparam: [],
    };
  } else {
    const fields = Object.keys(data);
    const sqlparam = [];
    if (fields.length === 0) {
      throw new UsageError('未指定where条件，如不希望指定where条件，请不要传入参数', data);
    }
    const andconditions = fields.map((field) => {
      let singlecondition;
      if (data[field] instanceof Condition) {
        data[field].values.forEach(value => sqlparam.push(value));
        singlecondition = data[field].wheresql(field);
      } else {
        sqlparam.push(data[field]);
        singlecondition = ` ${field} = ? `;
      }
      return singlecondition;
    });
    log.debug('andconditions', JSON.stringify(andconditions));
    const wherecondition = andconditions.join(' and ');
    result = {
      sqlwhere: ` where ${wherecondition} `,
      sqlparam,
    };
  }
  log.debug('data2Where output', JSON.stringify(result));
  return result;
}

async function data2Insert(data, insertschema) {
  log.debug('data2Insert input:', data);
  await inputcheck(data, insertschema, true);
  const insertFiledKeys = Object.keys(data);
  const insertFiledsCondition = insertFiledKeys.join(' , ');
  const sqlparam = insertFiledKeys.map(keyfield => data[keyfield]);
  const insertValuesCondition = insertFiledKeys.map(() => '?').join(' , ');
  const sql = `(${insertFiledsCondition}) values (${insertValuesCondition})`;
  const result = {
    sql,
    sqlparam,
  };
  log.debug('data2insert output', result);
  return result;
}

async function data2Set(data, fullschema) {
  log.debug('data2Set input', data);
  const setFields = Object.keys(data);
  if (setFields.length === 0) {
    throw new DefaultBizError('set项目未设定', data);
  }
  const checkschema = {};
  setFields.forEach((field) => {
    if (fullschema[field]) {
      checkschema[field] = fullschema[field];
    } else {
      throw new DataError(`${field}在表中不存在`);
    }
  });
  await inputcheck(data, checkschema, true);
  const setstring = setFields.map(keyfield => `${keyfield} = ?`).join(' , ');
  const sqlparam = setFields.map(keyfield => data[keyfield]);
  const sql = ` set ${setstring} `;
  log.debug('data2Where output', sql);
  return {
    sql,
    sqlparam,
  };
}

// 从dataObject中，获取keyFieldList有的字段，产生一个新的dataObject并返回,
function getFieldsFromObject(dataObject, fieldList, strictMode) {
  // log.debug('getFieldsFromObject input', JSON.stringify(dataObject), JSON.stringify(fieldList));
  const newObject = {};
  if (fieldList instanceof Array) {
    fieldList.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(dataObject, field)) {
        newObject[field] = dataObject[field];
      } else if (strictMode) {
        throw new DefaultBizError(`主key字段${field}不存在`, dataObject);
      }
    });
  } else {
    throw new DefaultBizError('参数2非数组类型', fieldList);
  }
  log.debug('getFieldsFromObject input', newObject);
  return newObject;
}

// function getBaseInsertSql(tablename, fields) {
//   const fieldsstring = fields.join(',');
//   const sql = `Insert into ${tablename} (${fieldsstring}) values`;
//   return sql;
// }


function db2timestamp2moment(params) {
  const params1 = params.substring(0, 10);
  const parmas2 = params.substring(11, 19);
  const parmas3 = parmas2.replace(/\./g, ':');
  const time = `${params1} ${parmas3}`;
  const newtime = moment.utc(time);
  if (!newtime.isValid()) {
    throw new UsageError(`${params}が日付形式ではありません`);
  }
  return newtime;
}

function db2timestampFormatForUI(db2timestamp) {
  let result;
  if (!db2timestamp) {
    result = '';
  } else {
    result = db2timestamp2moment(db2timestamp).format('YYYY-MM-DD hh:mm:ss');
  }
  return result;
}

// 返回ts2 - ts1的差，单位：秒
function momenttimestampgap(ts1, ts2) {
  const gap = Math.round((ts2 - ts1) / 1000);
  return gap;
}

// 返回ts2 - ts1的差，单位：秒
function db2timestampgap(ts1, ts2) {
  const momentts1 = db2timestamp2moment(ts1);
  const momentts2 = db2timestamp2moment(ts2);
  const gap = Math.round((momentts2 - momentts1) / 1000);
  return gap;
}

function getCurrentTimestampString(paramformat) {
  const format = paramformat || 'YYYY-MM-DD-hh.mm.ss.000000';
  return moment().utc().format(format).toString();
}

function getCurrentTimestamp() {
  return moment().utc();
}

module.exports.inputcheck = inputcheck;
module.exports.data2Where = data2Where;
module.exports.data2Set = data2Set;
module.exports.data2Insert = data2Insert;
module.exports.getFieldsFromObject = getFieldsFromObject;
module.exports.db2timestamp2moment = db2timestamp2moment;
module.exports.db2timestampgap = db2timestampgap;
module.exports.momenttimestampgap = momenttimestampgap;
module.exports.getCurrentTimestampString = getCurrentTimestampString;
module.exports.getCurrentTimestamp = getCurrentTimestamp;
module.exports.db2timestampFormatForUI = db2timestampFormatForUI;
