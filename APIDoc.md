# dataModel API 文档

**查找**
*  [.retrieveAll(order)](#retrieveAll)
*  [.retrieveCount(searchKey)](#retrieveCount)
*  [.retrieve(searchKey, count, order, IfLock)](#retrieve)
*  [.retrieveOne(searchKey, count, order, IfLock)](#retrieveOne)

**新增**

**更新**

**删除**

### <a name="retrieveAll"></a> .retrieveAll(order)
使用场景:抽出所有表数据

参数order为排序类，非必须，之后所有用到order的都请参考这里

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
// 不指定排序
const result = datamodel.retrieveAll();
// 指定排序 order by a,b desc 
const result = datamodel.retrieveAll(Order.base().asc('a').desc('b'));
```
### <a name="retrieveCount"></a> .retrieveCount(searchKey)
使用场景:抽出指定条件的记录数

参数searchKey的用法请参考这里

```javascript
const { Where } = require('@cic-digital/node-dao-db2');
// 不指定条件
const result = datamodel.retrieveAll();
// 指定条件
// where a = 1 and b = 2 and c like 'a%b'
// and d > '1' and e >= '2',
// and f < '3' and g <= '4',
// and h > '1' and h <= '4',
const searchKey = {
  a: 1,
  b: 2,
  c: Where.base().like('a%b'),
  d: Where.base().greater('1'),
  e: Where.base().greaterequal('2'),
  f: Where.base().less('3'),
  g: Where.base().lessequal('4'),
  h: Where.base().greater('1').lessequal('3'),
}
const result = datamodel.retrieveAll(searchKey);
```
### <a name="retrieve"></a> .retrieve(searchKey, count, order, IfLock)
使用场景:抽出指定条件的记录

参数searchKey的用法请参考[.retrieveCount(searchKey)](#retrieveCount)
参数order的用法请参考[.retrieveAll(order)](#retrieveAll)

```javascript
// 抽出指定条件的记录
const result1 = datamodel.retrieve(searchKey);
// 抽出指定条件的前count条记录
const count = 2;
const result1 = datamodel.retrieve(searchKey, count);
// 抽出指定条件的记录，按order来排序
const result1 = datamodel.retrieve(searchKey, order);
// 抽出指定条件记录并锁住
const result1 = datamodel.retrieve(searchKey, IfLock);
```

### <a name="retrieveOne"></a> .retrieveOne(searchKey, count, order, IfLock)
