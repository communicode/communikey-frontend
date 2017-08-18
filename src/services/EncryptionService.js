import forge from "node-forge";
import fileDownload from "react-file-download";
import _ from "lodash";

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
    this.encryptedPrivateKeyPem = "";
    this.publicKey = "";
    this.publicKeyPem = "";
    this.passphrase = "";
    this.passphraseNeeded = function () {};
  }

  setPassphrase = (passphrase) => {
    this.passphrase = passphrase;
  };

  checkPassphrase = () => {
    return new Promise((resolve, reject) => {
      let encryptedPem = localStorage.getItem("privateKey");
      this.encryptedPrivateKeyPem = encryptedPem;
      if (encryptedPem) {
        try {
          let decryptedPrivate = pki.decryptRsaPrivateKey(encryptedPem, this.passphrase);
          let decryptedPrivatePem = pki.privateKeyToPem(decryptedPrivate);
          this.privateKeyPem = encryptedPem;
          resolve({
            title: "Passphrase correct",
            message: "The passphrase is saved for 30 minutes."
          });
        } catch (e) {
          reject({
            title: "Passphrase wrong",
            message: "The passphrase couldn't be used to successfuly decrypt your private key."
          });
        }
      } else {
        reject({title: "No key found", message: "There is no key installed on your system."});
      }
    });
  };

  loadPrivateKey = (privateKey) => {
    return new Promise((resolve, reject) => {
      this.checkForPassphrase();
      privateKey && localStorage.setItem("privateKey", privateKey);
      let encryptedPem = localStorage.getItem("privateKey");
      this.encryptedPrivateKeyPem = encryptedPem;
      if (encryptedPem) {
        try {
          let decryptedPrivate = pki.decryptRsaPrivateKey(encryptedPem, this.passphrase);
          let decryptedPrivatePem = pki.privateKeyToPem(decryptedPrivate);
          this.privateKeyPem = encryptedPem;
          this.publicKey = pki.rsa.setPublicKey(decryptedPrivate.n, decryptedPrivate.e);
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

  checkForPassphrase = () => {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(this.passphrase)) {
        this.passphraseNeeded(true, resolve, reject);
      }
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
    return new Promise((resolve, reject) => {
      this.checkForPassphrase()
        .then(() => {
          let decryptedPrivate = pki.decryptRsaPrivateKey(this.encryptedPrivateKeyPem, this.passphrase);
          const binary = new Buffer(value, "base64").toString("binary");
          let decrypted = decryptedPrivate.decrypt(binary, "RSAES-PKCS1-V1_5", {
            md: forge.md.sha256.create(),
            encoding: "base64"
          });
          resolve(decrypted);
        })
        .catch(() => {
          console.log("Catch!");
          reject();
        });
    });
  };

  encryptForUser = (value) => {
    return this.encrypt(value, this.publicKey);
  };

}

export default EncryptionService;
