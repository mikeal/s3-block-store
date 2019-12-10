'use strict'
const assert = require('assert')
const { it } = require('mocha')
const main = require('../')
const Block = require('@ipld/block')
const AWS = require('mock-aws-s3')
const mkdirp = require('mkdirp')

mkdirp.sync('/tmp/buckets')
AWS.config.basePath = '/tmp/buckets'

const test = it

test('basic put/get', async () => {
  const block = Block.encoder({ hello: 'world' }, 'dag-cbor')
  const store = main('testBucket', undefined, AWS)
  await store.put(block)
  const ret = await store.get(await block.cid())
  assert.deepStrictEqual(ret.decode(), block.decode())
  assert.strictEqual(13, await store.has(await block.cid()))
})
