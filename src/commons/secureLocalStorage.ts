import { decrypt, encrypt } from "./aesHelpers";
import Helpers from "./helpers";

export default class SecureStorageStore implements Storage
{
    private _storage: any;

    constructor(storage?: any) {
        if (storage) {
            this._storage = storage;
        } else {
            this._storage = !Helpers.isServerside() ? window.localStorage : undefined;
        }
    }

    getItem(key: string) {
        const encryptedValue = this._storage.getItem(key);
        const decryptedValue = decrypt(encryptedValue);
        return decryptedValue;
    }

    setItem(key: string, value: string) {
        const encryptedValue = encrypt(value);
        this._storage.setItem(key, encryptedValue);
    }

    removeItem(key: string) {
        this._storage.removeItem(key);
    }

    get length() {
        return this._storage.length();
    }

    key(index: any) {
        return this._storage.key(index);
    }

    clear(): void {
        return this._storage.clear();
    }
}