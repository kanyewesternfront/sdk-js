import {TokenIO} from '../../src';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import MemberMethodsSample from '../../src/sample/MemberMethodsSample';

const {assert} = require('chai');

describe('MemberMethods test', () => {
    it('Should run the aliases sample', async () => {
        const devKey = require('../../src/config.json').devKey[TEST_ENV];
        const Token = new TokenIO({env: TEST_ENV, developerKey: devKey});
        const member = await CreateMemberSample();
        await MemberMethodsSample.aliases(Token, member);
        const aliases = await member.aliases();
        assert.equal(aliases.length, 1);
        assert.isTrue(aliases[0].value.includes('alias4'));
    });

    it('Should run the keys sample', async () => {
        const devKey = require('../../src/config.json').devKey[TEST_ENV];
        const Token = new TokenIO({env: TEST_ENV, developerKey: devKey});

        const member = await CreateMemberSample();
        await MemberMethodsSample.keys(Token, member);
    });

    it('Should run the addresses sample', async () => {
        const member = await CreateMemberSample();
        const addresses = await MemberMethodsSample.addresses(member);
        assert.equal(addresses.length, 1);
    });

    it('Should run the profiles sample', async () => {
        const member = await CreateMemberSample();
        const profile = await MemberMethodsSample.profiles(member);
        assert.isOk(profile);
        assert.isOk(profile.displayNameFirst);
        assert.isOk(profile.displayNameLast);
    });

    it('Should run the trusted beneficiaries sample', async () => {
        const member = await CreateMemberSample();
        const trustedBeneficiaries = await MemberMethodsSample.trustedBeneficiaries(member);

        assert.isOk(trustedBeneficiaries);
        assert.equal(trustedBeneficiaries.length, 1);
    });
});
