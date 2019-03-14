class DB2Error {
  constructor(functionname, error, database, sql, data) {
    // console.log(database);
    // database.db2conn.rollbackTransaction(err => reject(err));

    if (database) {
      if (database.transaction) {
        database.rollBack().then().catch();
      }
    }
    Error.call(this);
    Error.captureStackTrace(this);
    this.message = error.message;
    this.type = '数据库错误';
    this.code = 500;
    this.operational = true;
    this.errordata = {
      functionname,
      message: error.message,
      error: error.error,
      state: error.state,
      sqlcode: error.sqlcode,
    };
    if (sql) {
      this.sqlinfo = {
        sql,
        data,
      };
    }
  }
}

module.exports.DB2Error = DB2Error;
