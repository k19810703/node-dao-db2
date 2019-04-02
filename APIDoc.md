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

order为排序类，所有用到order的都请参考这里

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
// 不指定排序
const result = datamodel.retrieveAll();
// 指定排序 order by a,b desc 
const result = datamodel.retrieveAll(Order.base().asc('a').desc('b'));
```

### <a name="retrieveCount"></a> .retrieveCount(searchKey)
### <a name="retrieve"></a> .retrieve(searchKey, count, order, IfLock)
### <a name="retrieveOne"></a> .retrieveOne(searchKey, count, order, IfLock)
