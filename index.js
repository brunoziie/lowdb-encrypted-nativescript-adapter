const AdapterBase = require('lowdb/adapters/Base');
const fs = require('file-system');
const crypt = require('./crypt');

class NativeScriptEncryptedAdapter extends AdapterBase {
    read () {
        const dbFilePath = this.syncFilePath();

        if (fs.File.exists(dbFilePath)) {
            try {
                const dbFile = fs.File.fromPath(dbFilePath);
                const data = dbFile.readTextSync();
                const decryptedData = crypt.decrypt(data);

                return data ? this.deserialize(data) : this.defaultValue;
            } catch (e) {
                if (e instanceof SyntaxError) {
                    e.message = `Malformed JSON in file: ${this.source}\n${e.message}`
                }
                throw e
            }
        } else {
            this.write(this.defaultValue);
            return this.defaultValue
        }
    }

    write (data) {
        const dbFile = fs.File.fromPath(this.syncFilePath());
        const encryptedData = crypt.encrypt(this.serialize(data));

        dbFile.writeTextSync(encryptedData);
    }

    syncFilePath () {
        const documents = fs.knownFolders.documents();
        return fs.path.join(documents.path, this.source);
    }
}

module.exports = NativeScriptEncryptedAdapter;
