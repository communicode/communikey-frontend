import forge from "node-forge";

const pki = forge.pki;
const rsa = forge.pki.rsa;

/**
 * Provides functions to encrypt and decrypt.
 *
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.15.0
 */

let privateKey = "";
let publicKey = "";
let passphrase = "passphrase";

const generate = () => {
  return new Promise(function (resolve, reject) {
    let keypair = rsa.generateKeyPair({bits: 512, e: 0x10001});
    resolve(keypair);
  });
};

class EncryptionService {
  loadPrivateKey = () => {
    let encryptedPem = localStorage.getItem("privateKey");
    if (encryptedPem) {
      console.log("Key found!");
      let decryptedPrivate = pki.decryptRsaPrivateKey(encryptedPem, passphrase);
      let decryptedPrivatePem = forge.pki.privateKeyToPem(decryptedPrivate);
      privateKey = pki.privateKeyFromPem(decryptedPrivatePem);
      publicKey = pki.rsa.setPublicKey(privateKey.n, privateKey.e);
    } else {
      console.log("No key found!");
    }
  };

  generateKeypair = (passphrase) => {
    generate().then((keypair) => {
      console.log("Generating keypair!");
      let encryptedPrivatePem = pki.encryptRsaPrivateKey(keypair.privateKey, passphrase);
      localStorage.setItem("privateKey", encryptedPrivatePem);
      this.loadPrivateKey();
    });
  };

  encrypt = (value, publicKey) => {
    let encrypted = publicKey.encrypt(value, "RSAES-PKCS1-V1_5", {
      md: forge.md.sha256.create(),
      encoding: "base64"
    });
    return new Buffer(encrypted, "binary").toString("base64");
  };

  decrypt = (value) => {
    const binary = new Buffer(value, "base64").toString("binary");
    return privateKey.decrypt(binary, "RSAES-PKCS1-V1_5", {
      md: forge.md.sha256.create(),
      encoding: "base64"
    });
  };

  encryptForUser = (value) => {
    return this.encrypt(value, publicKey);
  };

}

export default EncryptionService;
