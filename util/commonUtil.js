const { log } = require('./log');
// const constdata = require('./constdata');
const { DataError } = require('../UserDefineError/dataError');


function data2Where(data) {
  log.debug('data2Where input', data);
  const keyfields = Object.keys(data);
  if (keyfields.length === 0) {
    return {
      sqlparam: [],
      sqlwhere: '',
    };
  }
  const wherecondition = keyfields.map(keyfield => `${keyfield} = ?`).join(' and ');
  const sqlparam = keyfields.map((keyfield) => {
    if (data[keyfield] instanceof Object) {
      throw new DataError('无法处理多层级json对象', data);
    }
    return data[keyfield];
  });
  const result = {
    sqlwhere: ` where ${wherecondition} `,
    sqlparam,
  };
  log.debug('data2Where output', result);
  return result;
}

function data2Set(data) {
  log.debug('data2Set input', data);
  const keyfields = Object.keys(data);
  if (keyfields.length === 0) { return ''; }
  const wherecondition = keyfields.map(keyfield => `${keyfield} = ?`).join(' , ');
  const result = ` set ${wherecondition} `;
  log.debug('data2Where output', result);
  return result;
}

function filedsarray2Order(filedsarray) {
  log.debug('filedsarray2Order input', filedsarray);
  const result = filedsarray.length > 0 ? ` order by ${filedsarray.join(',')} ` : '';
  log.debug('filedsarray2Order output', result);
  return result;
}

// 从dataObject中，获取fieldList有的字段，产生一个新的dataObject并返回
function getFieldsFromObject(dataObject, fieldList) {
  log.debug('getFieldsFromObject input', dataObject, fieldList);
  const newObject = {};
  if (fieldList instanceof Array) {
    fieldList.forEach((field) => {
      if (dataObject[field]) {
        newObject[field] = dataObject[field];
      }
    });
  } else {
    throw new DataError('参数2必须是字符型数组', fieldList);
  }
  log.debug('getFieldsFromObject input', newObject);
  if (Object.keys(newObject).length === 0) {
    throw new DataError('条件里不包含该表的字段', dataObject)
  }
  return newObject;
}

module.exports.data2Where = data2Where;
module.exports.data2Set = data2Set;
module.exports.filedsarray2Order = filedsarray2Order;
module.exports.getFieldsFromObject = getFieldsFromObject;
