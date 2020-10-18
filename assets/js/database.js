console.debug('module database.js is loading');

const sqlite = require('sqlite3');
const dbName = 'registry.db';

var db = null;

var close = function ()
{
    console.debug('closing db');
    return new Promise(function (resolve, reject) {
        if (db !== null) {
            db.close(function (error) {
                db = null;
                if (null === error) {
                    resolve();
                } else {
                    reject(error);
                }
            });
        } else {
            resolve();
        }
    });
};

var open = function ()
{
    if (db !== null) {
        close();
    }
    console.debug('opening db');
    return new Promise(function (resolve, reject) {
        var aux = new sqlite.Database(dbName, sqlite.OPEN_READWRITE, function (error) {
            if (null === error) {
                db = aux;
                resolve(db);
            } else {
                reject(error);
            }
        });
    });
};

export {
    open,
    close
};
