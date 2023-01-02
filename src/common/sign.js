import * as jose from 'jose'
import { pki } from 'node-forge'
import any from 'promise.any'

const rawPrivate = ({ alg, use, key_ops, ext, ...jwk }) => jwk

function symmetricSecret(key, alg, base64Secret) {
  const secret = base64Secret ? Buffer.from(key, 'base64') : Buffer.from(key)

  const len = Math.max(parseInt(alg.substr(-3), 10) >> 3, secret.byteLength)

  const padded = new Uint8Array(len)
  padded.set(secret)

  return Promise.resolve(padded)
}

function getJoseKey(header, key) {
  if (header.alg.indexOf('HS') === 0) {
    return symmetricSecret(key, header.alg)
  }
  let trueKey = key
  if (trueKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')) {
    trueKey = pki.privateKeyInfoToPem(pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(pki.privateKeyFromPem(trueKey))))
  }
  return any([
    jose.importPKCS8(trueKey, header.alg),
    Promise.resolve()
      .then(() => JSON.parse(trueKey))
      .then(rawPrivate)
      .then((jwk) => {
        if (!('d' in jwk)) throw new Error('not a private JWK')
        return jose.importJWK(jwk, header.alg)
      }),
  ])
}

export function sign(header, payload, secretOrPrivateKeyString) {
  if (!header.alg) {
    return Promise.reject(new Error('Missing "alg" claim in header'))
  }
  let payloadStr = payload
  return getJoseKey(header, secretOrPrivateKeyString).then((key) => {
    if (!(typeof payloadStr === 'string' || payloadStr instanceof String)) {
      payloadStr = JSON.stringify(payloadStr)
    }
    return new jose.CompactSign(new TextEncoder().encode(payloadStr)).setProtectedHeader(header).sign(key)
  })
}

export default {}
