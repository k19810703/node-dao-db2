# node-db2数据访问组件

##  node-db2数据访问组件

### 用法

####  接口一览
*   beginTransaction
*   insertByData
*   selectByKey
*   deleteByKey
*   updateByKey
*   selectByCondition
*   updateByCondition
*   deleteByCondition
*   executeSql
*   rollBack
*   commitTransaction

####  QuickStart
``` javascript
const Database = require('@cic-digital/node-dao-db2');

const DB2CONNECTSTRING = 'connect string';

// 如果你的处理有全局的识别key，可以第二参数来创建数据库实例，方便再日志中跟踪，
// 如果没有，第二参数可以不传，每一个Database实例会assign一个
const uuid = 'aaaa'
const database = new Database(DB2CONNECTSTRING, uuid);
// 例： 返回YOURTABLENAME表 符合
// FIELDNAME1='where condition1' and FIELDNAME2='where condition2'
// 的记录
// 同样可以使用await
// const result = await database.selectByCondition('YOURTABLENAME', {
//   FIELDNAME1: 'where condition1',
//   FIELDNAME2: 'where condition2',
// })
database.selectByCondition('YOURTABLENAME', {
  FIELDNAME1: 'where condition1',
  FIELDNAME2: 'where condition2',
})
  .then(result => console.log(result))
  .catch(error => console.log(error));
```