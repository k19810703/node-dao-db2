const format = require('string-format');
const { UsageError } = require('./UserDefineError/unvalidUsage');

class Where {
  constructor() {
    this.sqls = [];
    this.values = [];
  }

  static base() {
    return new Where();
  }

  wheresql(fieldname) {
    if (!fieldname) {
      throw new UsageError('filename is not provided');
    }
    if (!(typeof fieldname === 'string')) {
      throw new UsageError('filename should be a string');
    }
    let finalstr = '';
    if (this.sqls.length > 0) {
      finalstr = this.sqls.join(' and ');
    }
    return format(finalstr, fieldname);
  }

  like(value) {
    const sqlstring = ' {0} like ? ';
    this.sqls.push(sqlstring);
    this.values.push(value);
    return this;
  }

  greater(value) {
    const sqlstring = ' {0} > ? ';
    this.sqls.push(sqlstring);
    this.values.push(value);
    return this;
  }

  greaterequal(value) {
    const sqlstring = ' {0} >= ? ';
    this.sqls.push(sqlstring);
    this.values.push(value);
    return this;
  }

  less(value) {
    const sqlstring = ' {0} < ? ';
    this.sqls.push(sqlstring);
    this.values.push(value);
    return this;
  }

  lessequal(value) {
    const sqlstring = ' {0} <= ? ';
    this.sqls.push(sqlstring);
    this.values.push(value);
    return this;
  }
}

module.exports = Where;
