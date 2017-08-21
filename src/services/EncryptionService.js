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
    this.initialized = false;
    this.encryptedPrivateKeyPem = "";
    this.publicKey = "";
    this.publicKeyPem = "";
    this.passphrase = "";
    this.passphraseNeeded = function () {};
  }

  /**
   * A setter for the passphrase, handles the variable expiration by deleting it after 30 minutes.
   *
   * @author dvonderbey@communicode.de
   * @since 0.15.0
   */
  setPassphrase = (passphrase) => {
    this.passphrase = passphrase;
    setInterval(() => {
      this.passphrase = "";
    }, 30 * 60 * 1000);
  };

  /**
   * Checks if the set passphrase is valid.
   *
   * @author dvonderbey@communicode.de
   * @return {Promise} - The promise for the passphrase check process
   * @since 0.15.0
   */
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

  /**
   * Loads the private key by decrypting it with the supplied passphrase & sets the public key.
   * Checks for the passphrase beforehand.
   *
   * @author dvonderbey@communicode.de
   * @return {Promise} - The promise for the private key loading process
   * @since 0.15.0
   */
  loadPrivateKey = (privateKey) => {
    return new Promise((resolve, reject) => {
      this.checkForPassphrase()
        .then(() => {
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
              this.initialized = true;
              resolve();
            } catch (e) {
              reject({title: "Key loading failed", message: "The key on your system seems to be corrupted or the passphrase is wrong."});
            }
          } else {
            reject({title: "No key found", message: "There is no key installed on your system."});
          }
        });
    });
  };

  /**
   * Generates a 512 bit RSA keypair. Uses a rudimentary way to not block 100% of the thread.
   *
   * @author dvonderbey@communicode.de
   * @return {Promise} - The promise for the keypair generation process
   * @since 0.15.0
   */
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

  /**
   * Generates a keypair & encrypts it before saving it to the local storage.
   *
   * @author dvonderbey@communicode.de
   * @return {Promise} - The promise for the keypair generation & encryption process
   * @since 0.15.0
   */
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

  /**
   * Starts a download of the encrypted private key as a file.
   *
   * @author dvonderbey@communicode.de
   * @since 0.15.0
   */
  downloadPrivateKey = () => {
    if (this.privateKeyPem) {
      fileDownload(localStorage.getItem("privateKey"), "privateKey.pem");
    }
  };

  /**
   * Checks for a passphrase & invokes the passphrase modal if none is available.
   *
   * @author dvonderbey@communicode.de
   * @return {Promise} - The promise for the passphrase invocation.
   * @since 0.15.0
   */
  checkForPassphrase = () => {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(this.passphrase)) {
        this.passphraseNeeded(true, resolve, reject);
      } else {
        resolve();
      }
    });
  };

  /**
   * Encrypts the given value with the given public key.
   *
   * @author dvonderbey@communicode.de
   * @return {string} - The encrypted value as a base64 encoded string.
   * @since 0.15.0
   */
  encrypt = (value, publicKey) => {
    let encrypted = publicKey.encrypt(value, "RSAES-PKCS1-V1_5", {
      md: forge.md.sha256.create(),
      encoding: "base64"
    });
    return new Buffer(encrypted, "binary").toString("base64");
  };

  /**
   * Decrypts the given value with the local private key. Uses a promise because of the passphrase modal invocation.
   *
   * @author dvonderbey@communicode.de
   * @return {Promise} - The promise for the decryption process
   * @since 0.15.0
   */
  decrypt = (value) => {
    !this.initialized && this.loadPrivateKey();
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

  /**
   * Shortcut to encrypt for the local user's public key.
   *
   * @author dvonderbey@communicode.de
   * @return {string} - The encrypted value as a base64 encoded string.
   * @since 0.15.0
   */
  encryptForUser = (value) => {
    return this.encrypt(value, this.publicKey);
  };

}

export default EncryptionService;
