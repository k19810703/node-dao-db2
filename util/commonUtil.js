const Joi = require('joi');

const { UsageError } = require('../UserDefineError/unvalidUsage');
const { DefaultBizError } = require('../UserDefineError/DefaultBizError');
const { DataError } = require('../UserDefineError/dataError');


const { log } = require('./log');
const { Where } = require('../wherecondition');


async function inputcheck(data, schema, strictMode) {
  let allowUnknown;
  if (strictMode === undefined) {
    allowUnknown = true;
  } else if (typeof strictMode !== 'boolean') {
    throw new UsageError('inputcheck的第三参数必须是boolean型', strictMode);
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
  log.info('data2Where', Where);
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

      if (data[field] instanceof Where) {
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


module.exports.inputcheck = inputcheck;
module.exports.data2Where = data2Where;
module.exports.data2Set = data2Set;
module.exports.data2Insert = data2Insert;
module.exports.getFieldsFromObject = getFieldsFromObject;
