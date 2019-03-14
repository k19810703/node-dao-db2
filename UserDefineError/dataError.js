class DataError {
  constructor(message, data) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.message = message;
    this.type = '数据不整合';
    this.code = 500;
    this.operational = true;
    this.errordata = data || '';
  }
}

module.exports.DataError = DataError;
