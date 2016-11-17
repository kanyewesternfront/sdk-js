import nacl from "tweetnacl";
import base64Url from "base64url";

class Util {
    /**
     * Generates a random nonce
     *
     * @returns string nonce
     */
    static generateNonce() {
        return base64Url(nacl.sign.keyPair().publicKey);
    }

    /**
     * Count the number of decimal points in a number
     *
     * @param value: number
     * @returns {number} number of decimals
     */
   static countDecimals(value) {
       if(Math.floor(value) === value) {
           return 0;
       }
       return value.toString().split(".")[1].length || 0;
    }

    /**
     * Helper method to handle promise exceptions. The function will be executed, and if
     * anything fails, a rejected promise is returned, with the method name that failed,
     * included in the rejection.
     *
     * @param method: outside method that is being executed
     * @param fn: function to try to execute
     * @returns successful or rejected promise
     */
    static async call(method, fn) {
        try {
            return await fn();
        } catch (err) {
            return Promise.reject({
                type: method.name,
                error: err,
                reason: (err.response !== undefined && err.response.data !== undefined)
                    ? err.response.data
                    : "UNKNOWN"
            });
        }
    }
}
export default Util;
