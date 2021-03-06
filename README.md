# node-db2 data access component

[Chinese](README_CN.md)


##  this package can help user easy build db2 data access object

### How to use

####  install
```
npm install --save @cic-digital/node-dao-db2
```

####  QuickStart
example can be found in ./example

Step1 create business model, for example: user, define ddl first
```
CREATE TABLE user (
   userid    VARCHAR(100) NOT NULL,
   password  VARCHAR(50) NOT NULL,
   username  VARCHAR(200) NOT NULL,
   userlevel CHAR(1) NOT NULL,
   updatetimestamp TIMESTAMP NOT NULL GENERATED ALWAYS FOR EACH ROW ON UPDATE AS ROW CHANGE TIMESTAMP,
   PRIMARY KEY (userid));
```

Step2 based on this business model , create a datamodel(bizModel.js)

``` javascript
// schema check package
const Joi = require('joi');
// require base datamodel module
const { DataModel } = require('../dataModel');

// define user class extend base datamodel
class User extends DataModel {
  constructor(database) {
    super(database);
    // define schema
    this.fullschema = {
      USERID: Joi.string().max(100).required(),
      PASSWORD: Joi.string().max(50).required(),
      USERNAME: Joi.string().max(50).required(),
      USERLEVEL: Joi.string().valid('0', '1', '2', '3'),
      UPDATETIMESTAMP: Joi.string(),
    };
    // define unique key
    this.keyfieldlist = ['USERID'];
    // define auto setting field list
    this.autosetlist = ['UPDATETIMESTAMP'];
    // define table name
    this.tablename = 'USER';
  }

  // your customize function goes here
  async mycustomfunction() {
    const sql = `select * from ${this.tablename} where USERID = ?`;
    const result = await this.database.executeSql(sql, ['userid']);
    return result;
  }
}

module.exports.User = User;
```
[schema usage](https://github.com/hapijs/joi)

Step3 create your business process module(bizProcess.js)

you don't need handle commit or rollback in your buisiness process，all you need to do is add transaction to your export.

``` javascript
const { transaction } = require('../index');
const { log } = require('../util/log');
const { User } = require('./bizModel');
const { Where } = require('../index');

async function bizProcess(database, uuid, data) {
  log.info(uuid, 'bizProcess start');
  const user = new User(database);
  // define new user data
  const newuser = {
    USERID: data.userid,
    PASSWORD: data.password,
    USERNAME: data.username,
    USERLEVEL: '1',
  };
  // create user record 
  const newuserdata = await user.create(newuser);
  log.info('newuserdata', newuserdata);
  // define search key, in this case, search condition was set to USERLEVEL >0 AND USERLEVEL < 10
  const usersearchkey = {
    USERLEVEL: Where.base().greater(0).less(10),
  };
  // get search result
  const searchresult = await user.retrieve(usersearchkey);
  log.info(uuid, 'searchresult', searchresult);
  log.info(uuid, 'bizProcess normal end');
  return searchresult;
}

// export your business process and claim it to be transaction
module.exports.bizProcess = transaction(bizProcess);
```

Step4 create your main process module(main.js)
``` javascript
const uuidv4 = require('uuid/v4');
const { bizProcess } = require('./bizProcess');
const { log } = require('../util/log');

// parameter
const testdata = {
  userid: 'testuser',
  password: '12345',
  username: 'testusername',
};

// call your business process
bizProcess(uuidv4(), testdata)
  .then(result => log.info(result))
  .catch(error => log.error(error));
```

*before you use this package , please define below enviroment
```
export DB2DATABASE=yourdatabasename
export DB2HOSTNAME=databaseip
export DB2UID=userid
export DB2PWD=password
export DB2PORT=port
```

pre-defined api like retrieve， create [API Doc](https://github.com/k19810703/node-dao-db2/blob/master/APIDoc.md)
