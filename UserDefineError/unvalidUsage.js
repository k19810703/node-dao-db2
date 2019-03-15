class UsageError {
  constructor(message, data) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.message = message;
    this.type = 'node-dao-db2用法错误';
    this.code = 500;
    this.operational = true;
    this.errordata = data || '';
  }
}

module.exports.UsageError = UsageError;
