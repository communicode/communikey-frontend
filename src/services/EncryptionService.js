import forge from "node-forge";
import fileDownload from "react-file-download";

const pki = forge.pki;
const rsa = forge.pki.rsa;

/**
 * Provides functions to encrypt and decrypt.
 *
 * @author dvonderbey@communicode.de
 * @author lleifermann@communicode.de
 * @since 0.15.0
 */

class EncryptionService {
  privateKey;
  publicKey;
  passphrase;

  constructor() {
    this.privateKey = "";
    this.privateKeyPem = "";
    this.publicKey = "";
    this.publicKeyPem = "";
    this.passphrase = "";
  }

  setPassphrase = (passphrase) => {
    this.passphrase = passphrase;
  };

  loadPrivateKey = (privateKey) => {
    return new Promise((resolve, reject) => {
      privateKey && localStorage.setItem("privateKey", privateKey);
      let encryptedPem = localStorage.getItem("privateKey");
      if (encryptedPem) {
        try {
          let decryptedPrivate = pki.decryptRsaPrivateKey(encryptedPem, this.passphrase);
          let decryptedPrivatePem = pki.privateKeyToPem(decryptedPrivate);
          this.privateKeyPem = decryptedPrivatePem;
          this.privateKey = pki.privateKeyFromPem(decryptedPrivatePem);
          this.publicKey = pki.rsa.setPublicKey(this.privateKey.n, this.privateKey.e);
          this.publicKeyPem = pki.publicKeyToPem(this.publicKey);
          resolve();
        } catch (e) {
          reject({title: "Key loading failed", message: "The key on your system seems to be corrupted or the passphrase is wrong."});
        }
      } else {
        reject({title: "No key found", message: "There is no key installed on your system."});
      }
    });
  };

  generate = () => {
    return new Promise((resolve) => {
      let state = rsa.createKeyPairGenerationState(512, 0x10001);
      let step = () => {
        if (!rsa.stepKeyPairGenerationState(state, 100)) {
          setTimeout(step, 1);
        } else {
          resolve(state);
          return state;
        }
      };
      setTimeout(step);
    });
  };

  generateKeypair = (passphrase) => {
    this.setPassphrase(passphrase);
    return new Promise((resolve) => {
      this.generate().then((keypair) => {
        let encryptedPrivatePem = pki.encryptRsaPrivateKey(keypair.keys.privateKey, passphrase);
        localStorage.setItem("privateKey", encryptedPrivatePem);
        this.passphrase = passphrase;
        resolve({title: "Calculated Key", message: "Your private key has been successfully calculated."});
      });
    });
  };

  downloadPrivateKey = () => {
    if (this.privateKeyPem) {
      fileDownload(localStorage.getItem("privateKey"), "privateKey.pem");
    }
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
    return this.privateKey.decrypt(binary, "RSAES-PKCS1-V1_5", {
      md: forge.md.sha256.create(),
      encoding: "base64"
    });
  };

  encryptForUser = (value) => {
    return this.encrypt(value, this.publicKey);
  };

}

export default EncryptionService;
