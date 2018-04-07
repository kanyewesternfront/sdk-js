const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';
import ManualCryptoEngine from "../../../src/security/engines/ManualCryptoEngine";
import Util from '../../../src/Util';
import Crypto from '../../../src/security/Crypto';

describe('Manual crypto engines', () => {
    it('should create the manual crypto engines', () => {
        const memberId = Util.generateNonce();

        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        assert.isOk(engine);
    });

    it('should generate keys', async () => {
        const memberId = Util.generateNonce();
        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const pk2 = await engine.generateKey('STANDARD');
        const pk3 = await engine.generateKey('PRIVILEGED');
        const pk4 = await engine.generateKey('PRIVILEGED');
        assert.isOk(pk1);
        assert.isOk(pk2);
        assert.isOk(pk3);
        assert.isOk(pk4);
    });

    it('should not create a bad signer', async () => {
        const memberId = Util.generateNonce();
        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        await engine.generateKey('LOW');
        try {
            await engine.createSigner('STANDARD');
            return Promise.reject(new Error("should fail"));
        } catch (err) {
            assert.include(err.message, "No key");
        }
    });

    it('should have a signer with a key id', async () => {
        const memberId = Util.generateNonce();
        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        const pk1 = await await engine.generateKey('LOW');
        const signerLow = await await engine.createSigner('LOW');
        assert.equal(signerLow.getKeyId(), pk1.id);
    });

    it('should sign and verify', async () => {
        const memberId = Util.generateNonce();
        const lowKey = Crypto.generateKeys('LOW');
        ManualCryptoEngine.setKeys([
            lowKey,
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        const pk1 = await await engine.generateKey('LOW');
        const signer = await engine.createSigner('LOW');
        const verifier = await engine.createVerifier(pk1.id);
        const sig = signer.sign('abcdefg');
        verifier.verify('abcdefg', sig);
        Crypto.verify('abcdefg', sig, lowKey.publicKey);
    });

    it('should sign and verify json', async () => {
        const memberId = Util.generateNonce();
        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const signer = await engine.createSigner('LOW');
        const verifier = await engine.createVerifier(pk1.id);
        const sig = signer.signJson({a: 5, c: 14, b: -512});
        verifier.verifyJson({a: 5, c: 14, b: -512}, sig);
    });

    it('should fail to verify an invalid signature', async () => {
        const memberId = Util.generateNonce();
        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        const pk1 = await engine.generateKey('LOW');
        const signer = await engine.createSigner('LOW');
        const verifier = await engine.createVerifier(pk1.id);
        const sig = signer.sign('abcdefg');
        try {
            verifier.verify('bcdefg', sig);
            return Promise.reject(new Error("should fail"));
        } catch (err) {
            assert.include(err.message, "Invalid signature");
        }
    });

    it('should be able to create multiple engines', async () => {
        const memberId = Util.generateNonce();
        ManualCryptoEngine.setKeys([
            Crypto.generateKeys('LOW'),
            Crypto.generateKeys('STANDARD'),
            Crypto.generateKeys('PRIVILEGED'),
        ]);
        const engine = new ManualCryptoEngine(memberId);
        await engine.generateKey('LOW');
        const engine2 = new ManualCryptoEngine(memberId);
        const pk2 = await engine2.generateKey('STANDARD');
        const signer = await engine.createSigner('STANDARD');
        const verifier = await engine2.createVerifier(pk2.id);
        const sig = signer.sign('abcdefg');
        verifier.verify('abcdefg', sig);
    });

    it('should fail to log in to an empty browser', async () => {
        try {
            ManualCryptoEngine.setKeys([
                Crypto.generateKeys('LOW'),
                Crypto.generateKeys('STANDARD'),
                Crypto.generateKeys('PRIVILEGED'),
            ]);
            const engine = new ManualCryptoEngine();
            return Promise.reject(new Error("should fail to log in", engine));
        } catch (err) {
            assert.include(err.message, "Invalid memberId");
        }
    });
});