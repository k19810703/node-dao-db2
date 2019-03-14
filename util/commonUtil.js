const { log } = require('./log');
const constdata = require('./constdata');
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

module.exports.data2Where = data2Where;
module.exports.data2Set = data2Set;
module.exports.filedsarray2Order = filedsarray2Order;
