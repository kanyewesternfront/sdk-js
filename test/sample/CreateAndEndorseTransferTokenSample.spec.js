import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenSample
    from '../../src/sample/CreateAndEndorseTransferTokenSample';
import CreateTransferTokenWithUnusualOptionsSample
    from '../../src/sample/CreateTransferTokenWithUnusualOptionsSample';
import CreateTransferTokenToDestinationSample
    from '../../src/sample/CreateTransferTokenToDestinationSample';

const {assert} = require('chai');

describe('CreateAndEndorseTransferTokenSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res = await CreateAndEndorseTransferTokenSample(member, member2Alias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

describe('CreateTransferTokenWithUnusualOptionsSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const res = await CreateTransferTokenWithUnusualOptionsSample(member, member2);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

describe('CreateTransferTokenToDestinationSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        const member2Alias = await member2.firstAlias();
        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const res = await CreateTransferTokenToDestinationSample(member, member2Alias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});
