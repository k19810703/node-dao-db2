# node-db2数据访问组件

##  用法

### 条件检索
``` javascript
const Database = require('@cic-digital/node-dao-db2');

const DB2CONNECTSTRING = 'connect string';

const database = new Database(DB2CONNECTSTRING);
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