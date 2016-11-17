const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import NotifyStatus from "../../src/main/NotifyStatus";
import BankClient from "../sample/BankClient";

let member1 = {};
let username1 = '';

// Set up a first member
const setUp1 = async () => {
    username1 = Crypto.generateKeys().keyId;
    member1 = await Token.createMember(username1);
};

describe('Notifications', () => {
    beforeEach(setUp1);

    it('should create and get subscribers', async () => {
        const randomStr = Crypto.generateKeys().keyId;
        const subscriber = await member1.subscribeToNotifications(randomStr);
        const subscribers = await member1.getSubscribers();
        assert.equal(subscriber.id, subscribers[0].id);
    });

    it('should create and get subscriber by Id', async () => {
        const randomStr = Crypto.generateKeys().keyId;
        const subscriber = await member1.subscribeToNotifications(randomStr, "ANDROID");
        const subscriber2 = await member1.getSubscriber(subscriber.id);
        assert.equal(subscriber.platform, subscriber2.platform);
        assert.equal(subscriber.platform, "ANDROID");
    });

    it('should subscribe and unsubscribe device', async () => {
      const subscriber = await member1.subscribeToNotifications("8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B8E5F9402554");
      await member1.unsubscribeFromNotifications(subscriber.id);
      try {
          const status = await Token.notifyLinkAccounts(username1, "iron", 'bank-name', "alp...");
          return Promise.reject(new Error("Should fail"));
      } catch (err) {
          return true;
      }
    });

    it('should send a push for linking accounts', async () => {
        const target = Crypto.generateKeys().keyId;
        await member1.subscribeToNotifications(target);
        const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        const status = await Token.notifyLinkAccounts(username1, 'iron', 'bank-name', alp);
        assert.equal(status, NotifyStatus.SENT);
    });

    it('should send a push for adding key', async () => {
        const target = "DEV:9CF5BCAE80D74DEE05F040CBD57E1DC4F5FE8F1288A80A5061D58C1AD90FC77900";
        const keys = Crypto.generateKeys();
        const alp = await member1.subscribeToNotifications(target);
        await Token.notifyAddKey(username1, keys.publicKey, "Chrome 54.1");
    });

    it('should send a push for adding a key and linking accounts', async () => {
        const randomStr = '4011F723D5684EEB9D983DD718B2B2A484C23B7FB63FFBF15BE9F0F5ED239A5B';
        const keys = Crypto.generateKeys();
        await member1.subscribeToNotifications(randomStr)
        const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        await Token.notifyLinkAccountsAndAddKey(
                username1,
                'iron',
                'bank-name',
                alp,
                keys.publicKey,
                'Chrome 51.0');
    });

    it('should send an actual push to device', async () => {
        await member1.subscribeToNotifications('DEV:9CF5BCAE80D74DEE05F040CBD57E1DC4F5FE8F1288A80A5061D58C1AD90FC77900' +
            '8E5F9402554000')
        const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        await Token.notifyLinkAccounts(username1, 'iron', 'bank-name', alp);
    });
});
