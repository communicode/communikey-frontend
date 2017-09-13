import forge from "node-forge";
import fileDownload from "react-file-download";
import _ from "lodash";
import {authStore} from "../Communikey";

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
  /**
   * The state if a private key has successfully been loaded.
   *
   * @default false
   * @type {boolean}
   */
  initialized;

  /**
   * The encrypted private key object that node forge uses.
   *
   * @type {object}
   */
  privateKey;

  /**
   * The encrypted private key formatted in PEM.
   *
   * @default ""
   * @type {string}
   */
  encryptedPrivateKeyPem;

  /**
   * The public key object that node forge uses.
   *
   * @type {object}
   */
  publicKey;

  /**
   * The public key formatted in PEM.
   *
   * @default ""
   * @type {string}
   */
  publicKeyPem;

  /**
   * The passphrase entered by the user.
   *
   * @default ""
   * @type {string}
   */
  passphrase;

  /**
   * The passphrase needed callback set by the parent component
   *
   * @type {function}
   */
  passphraseNeeded;

  /**
   * The flag that indicates that the private key doesn't fit the one saved to the server.
   *
   * @type {boolean}
   */
  keyMismatch;

  constructor() {
    this.initialized = false;
    this.encryptedPrivateKeyPem = "";
    this.publicKey = "";
    this.publicKeyPem = "";
    this.passphrase = "";
    this.keyMismatch = false;
  }

  /**
   * A setter for the passphrase, handles the variable expiration by deleting it after 30 minutes.
   *
   * @author dvonderbey@communicode.de
   * @param passphrase - The passphrase
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
          pki.privateKeyToPem(decryptedPrivate);
          this.privateKeyPem = encryptedPem;
          this.publicKey = rsa.setPublicKey(decryptedPrivate.n, decryptedPrivate.e);
          let publicKeyPem = pki.publicKeyToPem(this.publicKey);
          this.publicKeyPem = publicKeyPem.replace(/[\r]+/g, "");
          resolve({
            title: "Passphrase correct",
            message: "The passphrase is saved for 30 minutes."
          });
        } catch (e) {
          this.passphrase = "";
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
   * @param privateKey - A privateKey if none is set in the localStorage
   * @return {Promise} - The promise for the private key loading process
   * @since 0.15.0
   */
  loadPrivateKey = (privateKey) => {
    return new Promise((resolve, reject) => {
      privateKey && localStorage.setItem("privateKey", privateKey);
      let encryptedPem = localStorage.getItem("privateKey");
      if (encryptedPem) {
        this.checkForPassphrase()
          .then(() => {
            this.encryptedPrivateKeyPem = encryptedPem;
            try {
              let decryptedPrivate = pki.decryptRsaPrivateKey(encryptedPem, this.passphrase);
              pki.privateKeyToPem(decryptedPrivate);
              this.privateKeyPem = encryptedPem;
              this.publicKey = rsa.setPublicKey(decryptedPrivate.n, decryptedPrivate.e);
              let publicKeyPem = pki.publicKeyToPem(this.publicKey);
              this.publicKeyPem = publicKeyPem.replace(/[\r]+/g, "");
              if (authStore.publicKey && !_.isEqual(this.publicKeyPem, authStore.publicKey)) {
                this.keyMismatch = true;
                reject({
                  title: "Key loading failed",
                  message: "The key on your system doesn't match your public key on the server."
                });
              }
              this.initialized = true;
              resolve();
            } catch (e) {
              this.passphrase = "";
              reject({
                title: "Key loading failed",
                message: "The key on your system seems to be corrupted or the passphrase is wrong."
              });
            }
          })
          .catch(() => {
            reject({
              title: "Key loading failed",
              message: "The passphrase is needed to decrypt your local private key."
            });
          });
      } else {
        if(authStore.publicKey) {
          reject({
            title: "No key found",
            message: "There is no key installed on your system. Please use the wizard to reinstall your key."}
          );
        } else {
          reject({
            title: "No key found",
            message: "You haven't setup a key for your account yet. Please use the wizard to install one."
          });
        }
      }
    });
  };

  /**
   * Generates a 4096 bit RSA keypair. Uses a rudimentary way to not block 100% of the thread.
   *
   * @author dvonderbey@communicode.de
   * @return {Promise} - The promise for the keypair generation process
   * @since 0.15.0
   */
  generate = () => {
    return new Promise((resolve) => {
      let state = rsa.createKeyPairGenerationState(4096, 0x10001);
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
   * @param passphrase - The passphrase to use for the key encryption
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
   * Encrypts the given value with the given public key to a base64 encoded string.
   *
   * @author dvonderbey@communicode.de
   * @param value - The string to encrypt
   * @param publicKeyPem - The public key in PEM format of the user to encrypt the content for
   * @return {string} - The encrypted value as a base64 encoded string.
   * @since 0.15.0
   */
  encrypt = (value, publicKeyPem) => {
    const publicKey = pki.publicKeyFromPem(publicKeyPem);
    let encrypted = publicKey.encrypt(value, "RSAES-PKCS1-V1_5", {
      md: forge.md.sha256.create(),
      encoding: "base64"
    });
    return new Buffer(encrypted, "binary").toString("base64");
  };

  /**
   * starts the decryption process by checking for the initialization state and triggering the loading
   * of a key if none has been loaded before.
   *
   * @author dvonderbey@communicode.de
   * @param value - The base64 string to decrypt with the user's private key
   * @return {Promise} - The promise for the decryption process
   * @since 0.15.0
   */
  decrypt = (value) => {
    return new Promise((resolve, reject) => {
      !this.initialized
        ? this.loadPrivateKey()
            .then(() => {
              this._decryptPassword(value)
                .then(decrypted => resolve(decrypted))
                .catch(error => reject(error));
            })
          .catch(error => reject(error))
        : this._decryptPassword(value)
            .then(decrypted => resolve(decrypted))
            .catch(error => reject(error));
    });
  };

  /**
   * Decrypts the given value with the local private key. Uses a promise because of the passphrase modal invocation.
   * For internal use in the decrypt method.
   *
   * @author dvonderbey@communicode.de
   * @param value - The base64 string to decrypt with the user's private key
   * @return {Promise} - The promise for the decryption process
   * @since 0.15.0
   */
  _decryptPassword = (value) => {
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
        .catch(error => reject(error));
    });
  };

  /**
   * Shortcut to encrypt for the local user's public key.
   *
   * @author dvonderbey@communicode.de
   * @param value - The string for the user to encrypt
   * @return {Promise} - The encrypted value as a base64 encoded string.
   * @since 0.15.0
   */
  encryptForUser = (value) => {
    return new Promise((resolve, reject) => {
      this.checkForPassphrase()
        .then(() => {
          let encrypted = this.encrypt(value, this.publicKeyPem);
          resolve(encrypted);
        })
        .catch(() => {
          reject();
        });
    });
  };

}

export default EncryptionService;
