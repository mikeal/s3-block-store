const AWS = require('aws-sdk')
const awsConfig = require('aws-config')
const Block = require('@ipld/block')

module.exports = (bucketName, profile = 'default', API = AWS) => {
  const s3 = new API.S3(awsConfig({ profile, sslEnabled: true }))
  const Bucket = bucketName

  const hasObject = key => {
    return new Promise((resolve, reject) => {
      s3.headObject({ Bucket, Key: key }, function (err, bool) {
        if (err) return resolve(false)
        if (!bool) return resolve(bool)
        if (this.httpResponse) {
          resolve(parseInt(this.httpResponse.headers['content-length']))
        } else {
          resolve(parseInt(bool.ContentLength))
        }
      })
    })
  }

  const getObject = async key => {
    const params = { Bucket, Key: key }
    return new Promise((resolve, reject) => {
      s3.getObject(params, (err, resp) => {
        if (err) return reject(err)
        resolve(resp.Body)
      })
    })
  }

  const putObject = (key, data) => {
    return new Promise((resolve, reject) => {
      s3.putObject({
        Bucket,
        Key: key,
        Body: data,
        ACL: 'public-read'
      }, (err, r) => {
        if (err) return reject(err)
        resolve(r)
      })
    })
  }

  const storeBlock = async block => {
    const cid = await block.cid()
    return putObject(`${cid.toString('base32')}`, block.encode())
  }
  const getBlock = async cid => {
    const data = await getObject(cid.toString('base32'))
    return Block.create(data, cid)
  }
  const hasBlock = cid => hasObject(cid.toString('base32'))

  const exports = {
    put: storeBlock,
    get: getBlock,
    has: hasBlock
  }

  return exports
}
