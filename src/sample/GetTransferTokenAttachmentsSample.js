/**
 * Fetches contents of a transfer token's attachments.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - id of the token to redeem
 * @return {Object} created transfer
 */
export default async (payee, tokenId) => {
    // Payee gets the token to see details
    const transferToken = await payee.getToken(tokenId);

    const allContents = [];

    const transferBody = transferToken.payload.transfer;
    for (let ix = 0; ix < transferBody.attachments.length; ix++) {
        // attachments have metadata but not the 'file' content
        const att = transferBody.attachments[ix];
        // download the content of the attachment[s] we want
        const blob = await payee.getTokenBlob(tokenId, att.blobId);
        const blobContents = blob.payload.data;
        allContents.push(blobContents);
    }
    return allContents;
};
