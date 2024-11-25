import CryptoJS from "crypto-js";
import Helpers from "./helpers";

const SECRECT_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";
const IV = process.env.NEXT_PUBLIC_IV || "";

const SECRECT_KEY_PARSED = CryptoJS.enc.Utf8.parse(SECRECT_KEY);
const IV_PARSED = CryptoJS.enc.Utf8.parse(IV);

export function encrypt(value: string) {
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRECT_KEY_PARSED, { iv: IV_PARSED }).toString();
    return encryptedValue;
}

export function decrypt(encodeValue: string) {
    if (Helpers.isNullOrEmpty(encodeValue)) {
        return "";
    }
    let bytes = CryptoJS.AES.decrypt(encodeValue, SECRECT_KEY_PARSED, { iv: IV_PARSED });
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
}

export { SECRECT_KEY, IV }