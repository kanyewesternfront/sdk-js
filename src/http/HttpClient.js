import Crypto from "../Crypto";
import {urls, KeyLevel} from "../constants";

const axios = require('axios');

class HttpClient {
    constructor(env){
        this._instance = axios.create({
            baseURL: urls[env]
        });
    }

    createMemberId() {
        const config = {
            method: 'post',
            url: '/members'
        };
        return this._instance(config);
    }

    usernameExists(username) {
        const config = {
            method: 'get',
            url: `/username-exists?username=${username}`
        };
        return this._instance(config);
    }

    notify(username, body) {
        const req = {
            username,
            body
        };
        const config = {
            method: 'post',
            url: `/notify`,
            data: req
        };
        return this._instance(config);
    }

    addFirstKey(keys, memberId, keyLevel = KeyLevel.PRIVILEGED) {
        const update = {
            memberId: memberId,
            addKey: {
                level: keyLevel,
                publicKey: Crypto.strKey(keys.publicKey),
                algorithm: Crypto.algorithm()
            }
        };

        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: keys.keyId,
                signature: Crypto.signJson(update, keys)
            }
        };
        const config = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req
        };
        return this._instance(config);
    }
}

export default HttpClient;
