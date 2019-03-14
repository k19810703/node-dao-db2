const { log } = require('./log');
// const constdata = require('./constdata');

function data2Where(data) {
  log.info('data2Where input', data);
  const keyfields = Object.keys(data);
  if (keyfields.length === 0) { return false; }
  const wherecondition = keyfields.map(keyfield => `${keyfield} = ?`).join(' and ');
  const sqlparam = keyfields.map(keyfield => data[keyfield]);
  const result = {
    sqlwhere: ` where ${wherecondition} `,
    sqlparam,
  };
  log.info('data2Where output', result);
  return result;
}

function data2Set(data) {
  log.info('data2Set input', data);
  const keyfields = Object.keys(data);
  if (keyfields.length === 0) { return ''; }
  const wherecondition = keyfields.map(keyfield => `${keyfield} = ?`).join(' , ');
  const result = ` set ${wherecondition} `;
  log.info('data2Where output', result);
  return result;
}

function filedsarray2Order(filedsarray) {
  log.info('filedsarray2Order input', filedsarray);
  const result = filedsarray.length > 0 ? ` order by ${filedsarray.join(',')} ` : '';
  log.info('filedsarray2Order output', result);
  return result;
}

module.exports.data2Where = data2Where;
module.exports.data2Set = data2Set;
module.exports.filedsarray2Order = filedsarray2Order;
