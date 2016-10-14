const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";
import PaymentToken from "../../src/main/PaymentToken";
import {defaultCurrency} from "../../src/constants";

let member1 = {};
let account1 = {};
let alias1 = {};

// Set up a first member
const setUp1 = () => {
    alias1 = Crypto.generateKeys().keyId;
    return Token
        .createMember(alias1)
        .then(res => {
            member1 = res;
            BankClient
                .requestLinkAccounts(alias1, 100000, 'EUR')
                .then(alp => member1
                    .linkAccounts('bank-id', alp)
                    .then(accs => {
                        account1 = accs[0];
                })
            );
        });
};

describe('PaymentTokens', () => {
    before(() => {
        return setUp1();
    });

    it('create a bank transfer token object', () => {
        const token = PaymentToken
            .create(member1, account1.id, 12.54, defaultCurrency, alias1, 'desc');
        const json = token.json;
        assert.equal(json.version, '1.0');
        assert.isOk(json.nonce);
        assert.equal(json.from.id, member1.id);
        assert.equal(json.bankTransfer.currency, defaultCurrency);
        assert.equal(json.bankTransfer.amount, '12.54');
        assert.equal(json.bankTransfer.transfer.source.accountId, account1.id);
    });
});