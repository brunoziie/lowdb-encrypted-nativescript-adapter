const settings = require('application-settings');
const crypto = require('crypto-js');
const AES = crypto.AES;
const UTF8 = crypto.enc.Utf8;
const uuid = require('uuid');
const KEY = 'encrypt-secret-key';

const getSecretKey = () => {
    if (settings.hasKey(KEY)) {
        return settings.getString(KEY);
    } else {
        const secret = uuid.v4();
        settings.setString(KEY, secret);
        return secret;
    }
};

module.exports.encrypt = function (data) {
    return AES.encrypt(data, getSecretKey()).toString();
};

module.exports.decrypt = function (data) {
    return AES.decrypt(data, getSecretKey()).toString(UTF8);
};