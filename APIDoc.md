# dataModel API 文档

*  [.retrieveAll(order)](#retrieveAll)

### <a name="retrieveAll"></a> .retrieveAll(order)
使用场景:抽出所有表数据

```javascript
const { Order } = require('@cic-digital/node-dao-db2');
// 不指定排序
const result = datamodel.retrieveAll();
// 指定排序 order by a,b desc
const result = datamodel.retrieveAll(Order.base().asc('a').desc('b'));
```
