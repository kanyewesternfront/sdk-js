import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseAccessTokenSample from '../../src/sample/CreateAndEndorseAccessTokenSample';
import GetAccessTokensSample from '../../src/sample/GetAccessTokensSample';
import ReplaceAndEndorseAccessTokenSample
    from '../../src/sample/ReplaceAndEndorseAccessTokenSample';
import TestUtil from '../TestUtil';

const {assert} = require('chai');

describe('ReplaceAndEndorseAccessTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();
        await TestUtil.waitUntil(async () => {
            assert.isOk(await member.firstAlias());
            assert.isOk(await member2.firstAlias());
        });
        await LinkMemberAndBankSample(member);

        const member2Alias = await member2.firstAlias();
        await CreateAndEndorseAccessTokenSample(member, member2Alias);
        const foundToken = await GetAccessTokensSample(member, member2.memberId());
        const newToken = await ReplaceAndEndorseAccessTokenSample(member, foundToken);
        assert.equal(
            JSON.stringify(newToken.payload.to.alias),
            JSON.stringify(member2Alias));
    });
});
