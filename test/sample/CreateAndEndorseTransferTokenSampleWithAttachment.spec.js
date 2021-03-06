import CreateMemberSample from '../../src/sample/CreateMemberSample';
import LinkMemberAndBankSample from '../../src/sample/LinkMemberAndBankSample';
import CreateAndEndorseTransferTokenWithAttachmentSample
    from '../../src/sample/CreateAndEndorseTransferTokenWithAttachmentSample';
import CreateTransferTokenAttachSample from '../../src/sample/CreateTransferTokenAttachSample';

const {assert} = require('chai');

describe('CreateAndEndorseTransferTokenWithAttachmentSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res =
            await CreateAndEndorseTransferTokenWithAttachmentSample(member, member2Alias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});

describe('CreateTransferTokenAttachSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const member2 = await CreateMemberSample();

        await LinkMemberAndBankSample(member);
        await LinkMemberAndBankSample(member2);

        const member2Alias = await member2.firstAlias();
        const res =
            await CreateTransferTokenAttachSample(member, member2Alias);
        assert.isAtLeast(res.payloadSignatures.length, 2);
    });
});
