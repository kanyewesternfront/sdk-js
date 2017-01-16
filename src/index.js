import Crypto from "./Crypto";
import Util from "./Util";
import Member from "./main/Member";
import {KeyLevel} from "./constants";
import LocalStorage from "./LocalStorage";
import HttpClient from "./http/HttpClient";
import AuthHttpClientUsername from "./http/AuthHttpClientUsername";
import AccessToken from "./main/AccessToken";

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();

// Main entry object
class Token {

    constructor(env = 'prd') {
        this._env = env;
        this._unauthenticatedClient = new HttpClient(env);
        this.KeyLevel = KeyLevel;
        this.Crypto = Crypto;
        this.Util = Util;
        this.AccessToken = AccessToken;
    }

    /**
     * Checks if a given username already exists
     * @param {string} username - username to check
     * @return {Promise} result - true if username exists, false otherwise
     */
    usernameExists(username) {
        return Util.callAsync(this.usernameExists, async () => {
            const res = await this._unauthenticatedClient.usernameExists(username);
            return res.data.exists ? res.data.exists : false;
        });
    }

    /**
     * Creates a member with an username and a keypair
     * @param  {string} username - username to set for member
     * @return {Promise} member - Promise of created Member
     */
    createMember(username) {
        return Util.callAsync(this.createMember, async () => {
            const keys = Crypto.generateKeys();
            const response = await this._unauthenticatedClient.createMemberId();
            await this._unauthenticatedClient.addFirstKey(keys, response.data.memberId);
            const member = new Member(this._env, response.data.memberId, keys);
            await member.addUsername(username);
            return member;
        });
    }

    /**
     * Log in a member (Instantiate a member object from keys and Id)
     * @param  {string} memberId - id of the member
     * @param  {object} keys - member's keys
     * @return {Promise} member - Promise of instantiated Member
     */
    login(memberId, keys) {
        return Util.callAsync(this.login, async () => {
            return new Member(this._env, memberId, keys);
        });
    }

    /**
     * Log in a member by keys and username. This is useful for checking whether we are
     * authenticated, after requesting to add a key (by notification). Can call this
     * every n seconds until it succeeds
     * @param  {object} keys - Member keys
     * @param  {string} username - username to authenticate with
     * @return {Promise} member - instantiated Member, if successful
     */
    loginWithUsername(keys, username) {
        return Util.callAsync(this.loginWithUsername, async () => {
            const res = await new AuthHttpClientUsername(this._env, username, keys).getMemberByUsername();
            return new Member(this._env, res.data.member.id, keys);
        });
    }

    /**
     * Logs a member in from keys stored in localStorage
     * @return {Promise} member - instantiated member
     */
    loginFromLocalStorage() {
        return Util.callAsync(this.loginFromLocalStorage, async () => {
            return LocalStorage.loadMember(this._env);
        });
    }

    /**
     * Notifies subscribers that accounts should be linked, and passes the bank id and
     * payload
     * @param {string} username - username to notify
     * @param {string} bankId - ID of the bank owning the accounts
     * @param {string} bankName - name of the bank owning the accounts
     * @param {string} accountLinkPayloads - accountLinkPayloads retrieved from the bank
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccounts(username, bankId, bankName, accountLinkPayloads) {
        const body = {
            linkAccounts: {
                bankId,
                bankName,
                accountLinkPayloads
            }
        };
        return Util.callAsync(this.notifyLinkAccounts, async () => {
            const res = await this._unauthenticatedClient.notify(username, body);
            return res.data.status;
        });
    }

    /**
     * Notifies subscribers that a key should be added and passes the public Key and
     * optional name
     * @param {string} username - username to notify
     * @param {string} publicKey - public
     * @param {string} name - name for the new key, (e.g Chrome 53.0)
     * @return {Promise} NotifyStatus - status
     */
    notifyAddKey(username, publicKey, name = '') {
        const body = {
            addKey: {
                publicKey: Crypto.strKey(publicKey),
                algorithm: Crypto.algorithm(),
                name
            }
        };
        return Util.callAsync(this.notifyAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(username, body)
            return res.data.status;
        });
    }

    /**
     * Notifies subscribed devices that accounts should be linked, and passes the bank id and
     * payload
     * @param {string} username - username to notify
     * @param {string} bankId - ID of the bank owning the accounts
     * @param {string} bankName - name of the bank owning the accounts
     * @param {string} accountLinkPayloads - accountsLinkPayload retrieved from the bank
     * @param {string} publicKey - public
     * @param {array} name - name for the new key, (e.g Chrome 53.0)
     * @return {Promise} NotifyStatus - status
     */
    notifyLinkAccountsAndAddKey(username, bankId, bankName, accountLinkPayloads, publicKey, name = "") {
        const body = {
            linkAccountsAndAddKey: {
                linkAccounts: {
                    bankId,
                    bankName,
                    accountLinkPayloads
                },
                addKey: {
                    publicKey: Crypto.strKey(publicKey),
                    algorithm: Crypto.algorithm(),
                    name
                }
            }
        };
        return Util.callAsync(this.notifyLinkAccountsAndAddKey, async () => {
            const res = await this._unauthenticatedClient.notify(username, body)
            return res.data.status;
        });
    }
};

module.exports = Token;

