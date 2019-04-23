# dataModel API Document

**Retrieve**
*  [.retrieveAll(order)](#retrieveAll)
*  [.retrieveCount(searchKey)](#retrieveCount)
*  [.retrieve(searchKey, count, order, IfLock)](#retrieve)
*  [.retrieveOne(searchKey, count, order, IfLock)](#retrieveOne)

**Create**
*  [.create(data)](#create)
*  [.bulkCreate(datas)](#bulkCreate)

**Update**
*  [.updateByCondition(keydata, setdata)](#updateByCondition)
*  [.updateByKey(data)](#updateByKey)


**Delete**
*  [.deleteByKey(data)](#deleteByKey)
*  [.deleteByCondition(data)](#deleteByCondition)


### <a name="retrieveAll"></a> .retrieveAll(order)
use case:retrieve all data from table

parameter order is a class provided by this package，it's optional

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
// no order
const result = datamodel.retrieveAll();
// order by a,b desc 
const result = datamodel.retrieveAll(Order.base().asc('a').desc('b'));
```
### <a name="retrieveCount"></a> .retrieveCount(searchKey)
use case:retrieve specify count records

parameter "searchKey" can be found here

```javascript
const { Where } = require('@cic-digital/node-dao-db2');
// search without condition
const result = datamodel.retrieveAll();
// search with condition eg:
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
use case:retrieve records by condition，return array

parameter searchKey useage please check [.retrieveCount(searchKey)](#retrieveCount)

parameter order useage please check [.retrieveAll(order)](#retrieveAll)

count should be number ，order should be instance of Order，IfLock shold be boolean，parameter searchKey is mandontory，other three parameters are optional, but should defined by order

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
// retrieve by condition
const result1 = datamodel.retrieve(searchKey);
// retrieve by condition and return first {count} records
const searchKey = { a: 1 };
const count = 2;
const IfLock = true
const order = Order.base().asc('a');
const result2 = datamodel.retrieve(searchKey, count);
// retrieve by condition with order
const result3 = datamodel.retrieve(searchKey, order);
// retrieve by condition and lock
const result4 = datamodel.retrieve(searchKey, IfLock);
// retrieve and lock by condition for  first {count} records
const result5 = datamodel.retrieve(searchKey, count, order, IfLock);
```

### <a name="retrieveOne"></a> .retrieveOne(searchKey, count, order, IfLock)
use case:retrieve the first record satisify search condition，return data object(not array),normally used by search by unique key, when search condition hit more than 1 record or hit no record raise error[.retrieve(searchKey, count, order, IfLock)](#retrieve)

### <a name="create"></a> .create(data)
use case:create single record and return created record(not array)

```javascript
// create data model , data should satisify schema check 
const data = {
  a: 1,
  b: '2',
}
const result = datamodel.create(data);
```

### <a name="bulkCreate"></a> .bulkCreate(datas)
use case:batch create records ，return all records created(array)

```javascript
// create data model , data should satisify schema check 
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
use case:update datas by condition，return all updated records(array)

parameter searchKey useage please check[.retrieveCount(searchKey)](#retrieveCount)

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
//update xxx set c = 3 , d = 4 where a = 1 and b =2
const result = datamodel.updateByCondition(searchKey, setdata);
```

### <a name="updateByKey"></a> .updateByKey(data)
use case:update by unique key，return updated record(not array)，if search condition hit more than 1 record or hit no record , will not update and raise error

parameter searchKey useage please check[.retrieveCount(searchKey)](#retrieveCount)

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
const data = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
}
// in this case a is unique key and c is auto setting field
// update xxx set b = 3 , d = 4 where a = 1 
const result = datamodel.updateByKey(data);
```

### <a name="deleteByKey"></a> .deleteByKey(data)
same as[.updateByKey(data)](#updateByKey)

### <a name="deleteByCondition"></a> .deleteByCondition(data)
same as [.updateByCondition(keydata, setdata)](#updateByCondition)

# from Owner
any new requirement , please raise issue or contact k19810703@163.com