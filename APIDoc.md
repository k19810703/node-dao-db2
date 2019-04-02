# dataModel API 文档

**查找**
*  [.retrieveAll(order)](#retrieveAll)
*  [.retrieveCount(searchKey)](#retrieveCount)
*  [.retrieve(searchKey, count, order, IfLock)](#retrieve)
*  [.retrieveOne(searchKey, count, order, IfLock)](#retrieveOne)

**新增**
*  [.create(data)](#create)
*  [.bulkCreate(datas)](#bulkCreate)

**更新**
*  [.updateByCondition(keydata, setdata)](#updateByCondition)
*  [.updateByKey(data)](#updateByKey)


**删除**
*  [.deleteByKey(data)](#deleteByKey)
*  [.deleteByCondition(data)](#deleteByCondition)


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
使用场景:抽出指定条件的记录，返回数组类型

参数searchKey的用法请参考[.retrieveCount(searchKey)](#retrieveCount)

参数order的用法请参考[.retrieveAll(order)](#retrieveAll)

count为数字型，order为Order类的实例，IfLock为boolean型，除了必须的第一参数searchKey，后3个参数可以任意指定组合，但顺序不能变

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
// 抽出指定条件的记录
const result1 = datamodel.retrieve(searchKey);
// 抽出指定条件的前count条记录
const searchKey = { a: 1 };
const count = 2;
const IfLock = true
const order = Order.base().asc('a');
const result2 = datamodel.retrieve(searchKey, count);
// 抽出指定条件的记录，按order来排序
const result3 = datamodel.retrieve(searchKey, order);
// 抽出指定条件记录并锁住
const result4 = datamodel.retrieve(searchKey, IfLock);
// 抽出指定条件的前count条记录，按order条件排序并锁定
const result5 = datamodel.retrieve(searchKey, count, order, IfLock);
```

### <a name="retrieveOne"></a> .retrieveOne(searchKey, count, order, IfLock)
使用场景:抽出指定条件的1条记录，返回单条记录(非数组),通常用于主key检索，检索结果不为1条时报错，用法同[.retrieve(searchKey, count, order, IfLock)](#retrieve)

### <a name="create"></a> .create(data)
使用场景:创建单条记录，返回创建后的记录(非数组)

```javascript
// 创建指定模型的数据，数据必须符合模型定义的schema
const data = {
  a: 1,
  b: '2',
}
const result = datamodel.create(data);
```

### <a name="bulkCreate"></a> .bulkCreate(datas)
使用场景:批量创建记录，返回创建后的记录(数组)

```javascript
// 创建指定模型的数据，数据必须符合模型定义的schema
const datas = []
const data1 = {
  a: 1,
  b: '2',
}
const data2 = {
  a: 2,
  b: '2',
}
datas.push(data1);
datas.push(data2);
const result = datamodel.bulkCreate(datas);
```
### <a name="updateByCondition"></a> .updateByCondition(searchKey, setdata)
使用场景:根据条件更新数据库，返回数组更新完的数据(数组类型)

参数searchKey的用法请参考[.retrieveCount(searchKey)](#retrieveCount)

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
const searchKey = {
  a: 1,
  b: 2,
}
const setdata = {
  c: 3,
  d: 4,
}
// 相当于update xxx set c = 3 , d = 4 where a = 1 and b =2
const result = datamodel.updateByCondition(searchKey, setdata);
```

### <a name="updateByKey"></a> .updateByKey(data)
使用场景:根据主key更新数据库，返回数组更新完的数据(非数组类型)，如果更新结果不是1条则报错

参数searchKey的用法请参考[.retrieveCount(searchKey)](#retrieveCount)

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
const data = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
}
// 假设主key是a，c为数据库设定字段
// 相当于update xxx set b = 3 , d = 4 where a = 1 
const result = datamodel.updateByKey(data);
```

### <a name="deleteByKey"></a> .deleteByKey(data)
用法同[.updateByKey(data)](#updateByKey)

### <a name="deleteByCondition"></a> .deleteByCondition(data)
用法同 [.updateByCondition(keydata, setdata)](#updateByCondition)

如果有其他通用的方法希望在dataModel增加，请联系k19810703@163.com或提issue