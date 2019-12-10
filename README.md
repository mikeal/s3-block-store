# s3-block-store

Storage functions `@ipld/block` interface.

```javascript
const s3 = require('s3-block-store')
const store = s3('bucketName')

const { get, put, has } = store
```

## get(cid)

Return `Block` instance.

## has(cid)

Return false or integer (size).

## put(block)

Stores block instance by attached CID.
