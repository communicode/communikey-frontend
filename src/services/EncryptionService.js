import forge from "node-forge";
import {notificationService} from "../Communikey";

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
    this.publicKey = "";
    this.passphrase = "";
  }

  loadPrivateKey = () => {
    let encryptedPem = localStorage.getItem("privateKey");
    if (encryptedPem) {
      let decryptedPrivate = pki.decryptRsaPrivateKey(encryptedPem, this.passphrase);
      let decryptedPrivatePem = forge.pki.privateKeyToPem(decryptedPrivate);
      this.privateKey = pki.privateKeyFromPem(decryptedPrivatePem);
      this.publicKey = pki.rsa.setPublicKey(this.privateKey.n, this.privateKey.e);
      notificationService.info("Created Key", "Your private key has been successfully loaded.", 5);
    } else {
      notificationService.error("No key found", "There is no key installed on your system.", 5);
    }
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
    return new Promise((resolve) => {
      this.generate().then((keypair) => {
        let encryptedPrivatePem = pki.encryptRsaPrivateKey(keypair.keys.privateKey, passphrase);
        localStorage.setItem("privateKey", encryptedPrivatePem);
        this.passphrase = passphrase;
        resolve();
        notificationService.info("Calculated Key", "Your private key has been successfully calculated.", 5);
        this.loadPrivateKey();
      });
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
