// const chai = require('chai');
// const assert = chai.assert;
//
// const Token = require('../../src');
// import Crypto from '../../src/Crypto';
// const some = require('lodash/some');
// const map = require('lodash/map');
// import BankClient from '../sample/BankClient';
// import {defaultCurrency} from '../../src/constants';
//
// let member1 = {};
// let alias1 = '';
// let account1 = {};
//
// let alias2 = '';
//
// // Set up a first member
// const setUp1 = () => {
//   alias1 = Crypto.generateKeys().keyId;
//   return Token.createMember(alias1)
//     .then(res => {
//       member1 = res;
//       return BankClient.requestLinkAccounts(alias1, 100000, 'EUR').then(alp => {
//         return member1.linkAccounts('bank-id', alp).then(accs => {
//           account1 = accs[0];
//         });
//       });
//     });
// };
//
// describe('Tokens', () => {
//   beforeEach(() => {
//     return setUp1();
//   });
//
//   it('Create an address', () => {
//     return member1.createAddress("Home", "125 Broadway rd").then(res => {
//       assert.equal(1 + 1, 2);
//     });
//   });
// });