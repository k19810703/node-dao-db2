class DefaultBizError {
  constructor(message, data) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.message = message;
    this.type = '业务异常';
    this.code = 400;
    this.errordata = data || {};
  }
}

module.exports.DefaultBizError = DefaultBizError;
