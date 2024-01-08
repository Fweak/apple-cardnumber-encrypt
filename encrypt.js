const crypto = require("node:crypto").webcrypto;
const atob = e => Buffer.from(String.fromCharCode(...new Uint8Array(e)), 'utf-8').toString("base64")
const btoa = e => Buffer.from(e, "base64").toString("binary");

const n = e => {
  const t = new ArrayBuffer(e.length)
    , a = new Uint8Array(t);
  for (let t = 0, n = e.length; t < n; t++)
    a[t] = e.charCodeAt(t);
  return t
}

const textEncode = e => (new TextEncoder).encode(e)

const encryptCardNumber = async (config, cardNumber) => {
  let a = cardNumber
  'string' == typeof a && (a = a.replace(/\s/g, ''));

  const cryptoKey = await crypto.subtle.importKey(
    "spki",
    n(btoa(config.publicKey)),
    {
      name: "rsa-oaep",
      hash: "SHA-256"
    },
    false,
    ["encrypt"]
  );

  const encryptedCipherText = await crypto.subtle.encrypt({ name: "rsa-oaep" }, cryptoKey, textEncode(cardNumber));

  return {
    cipherText: atob(encryptedCipherText),
    publicKeyHash: config.publicKeyHash
  }
}


const cardNumber = "4242 4242 4242 4242";

const encryptionConfig = {
  "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvUIrYPRsCjQNCEGNWmSp9Wz+5uSqK6nkwiBq254Q5taDOqZz0YGL3s1DnJPuBU+e8Dexm6GKW1kWxptTRtva5Eds8VhlAgph8RqIoKmOpb3uJOhSzBpkU28uWyi87VIMM2laXTsSGTpGjSdYjCbcYvMtFdvAycfuEuNn05bDZvUQEa+j9t4S0b2iH7/8LxLos/8qMomJfwuPwVRkE5s5G55FeBQDt/KQIEDvlg1N8omoAjKdfWtmOCK64XZANTG2TMnar/iXyegPwj05m443AYz8x5Uw/rHBqnpiQ4xg97Ewox+SidebmxGowKfQT3+McmnLYu/JURNlYYRy2lYiMwIDAQAB",
  "publicKeyHash": "DsCuZg+6iOaJUKt5gJMdb6rYEz9BgEsdtEXjVc77oAs=",
  "algorithm": "rsa-oaep"
};

(async () => {
  const encryptedCardNumber = await encryptCardNumber(encryptionConfig, cardNumber)

  console.log(encryptedCardNumber)
})()
