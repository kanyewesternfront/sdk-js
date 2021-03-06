import Crypto from '../Crypto';
import Util from '../../Util';

/**
 * Base crypto engine that are extended by others.
 * It handles signatures, verifications, and key storage.
 */
class KeyStoreCryptoEngine {
    constructor(memberId, keystore) {
        if (!memberId) {
            throw new Error('Invalid memberId');
        }
        if (!keystore) {
            throw new Error('Invalid keystore');
        }
        this._memberId = memberId;
        this._keystore = keystore;
        if (memberId && keystore.constructor.setActiveMemberId) {
            keystore.constructor.setActiveMemberId(memberId);
        }
    }

    /**
     * Generate a key pair and store it.
     *
     * @param {string} level - 'LOW', 'STANDARD', or 'PRIVILEGED'
     * @param {number} expirationMs - (optional) expiration duration of the key in milliseconds
     * @return {Object} key in proto-compliant format
     */
    async generateKey(level, expirationMs) {
        const keyPair = await Crypto.generateKeys(level, expirationMs);
        const stored = await this._keystore.put(this._memberId, keyPair);
        stored.publicKey = Util.strKey(stored.publicKey);
        delete stored.privateKey;
        return stored;
    }

    /**
     * Create a signer. Assumes we previously generated the relevant key.
     *
     * @param {string} level - privilege level 'LOW', 'STANDARD', 'PRIVILEGED'
     * @return {Object} signer object that implements sign, signJson, and getKeyId
     */
    async createSigner(level) {
        const keyPair = await this._keystore.getByLevel(this._memberId, level);
        return Crypto.createSignerFromKeypair(keyPair);
    }

    /**
     * Create a verifier. Assumes we have the key with the passed ID.
     *
     * @param {string} keyId - ID of key to use
     * @return {Object} verifier object that implements verify and verifyJson
     */
    async createVerifier(keyId) {
        const keyPair = await this._keystore.getById(this._memberId, keyId);
        return Crypto.createVerifierFromKeypair(keyPair);
    }
}

export default KeyStoreCryptoEngine;
