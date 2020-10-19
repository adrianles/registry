console.debug('module database.js is loading');

const sqlite = require('sqlite3');
const dbName = 'registry.db';

var db = null;
var openPromise = null;

var _allQuery = function (query, params)
{
    params = params || [];
    return _toPromiseWhenOpen(function (resolve, reject) {
        db.all(query, params, function (error, rows) {
            if (null === error) {
                resolve(rows);
            } else {
                reject(error);
            }
        });
    });
};

var close = function ()
{
    console.debug('closing db');
    return _toPromiseWhenOpen(function (resolve, reject) {
        db.close(function (error) {
            db = null;
            if (null === error) {
                resolve();
            } else {
                reject(error);
            }
        });
    });
};

var getRegistries = function (isAsc)
{
    var order = isAsc ? 'ASC' : 'DESC';
    return _allQuery(
        "SELECT id, name, DATETIME(creation_date, 'localtime') AS creationDate, DATETIME(modification_date, 'localtime') AS modificationDate FROM registry ORDER BY creation_date " + order
    );
};

var getRegistryRows = function (registryId, isAsc)
{
    var order = isAsc ? 'ASC' : 'DESC';
    return _allQuery(
        "SELECT id, registry_id AS registryId, product, quantity, amount, DATETIME(creation_date, 'localtime') as creationDate FROM row WHERE registry_id = $registryId ORDER BY creation_date " + order,
        {$registryId: registryId}
    );
};

var insertRegistry = function (name)
{
    return _runQuery(
        "INSERT INTO registry (name, creation_date, modification_date) VALUES ($name, DATETIME('now'), DATETIME('now'))",
        {$name: name}
    ).then(function (stmt) {
        return stmt.lastID;
    });
};

var insertRow = function (row)
{
    return _runQuery(
        "INSERT INTO row (registry_id, product, quantity, amount, creation_date) VALUES ($registryId, $product, $quantity, $amount, STRFTIME('%Y-%m-%d %H:%M:%f', 'now'));",
        {$registryId: row.registryId, $product: row.product, $quantity: row.quantity, $amount: row.amount}
    ).then(function (stmt) {
        return stmt.lastID;
    });
};

var open = function ()
{
    if (db !== null) {
        close();
    }
    console.debug('opening db');
    openPromise = new Promise(function (resolve, reject) {
        var aux = new sqlite.Database(dbName, sqlite.OPEN_READWRITE, function (error) {
            openPromise = null;
            if (null === error) {
                db = aux;
                resolve(db);
            } else {
                reject(error);
            }
        });
    });
    return openPromise;
};

var _runQuery = function (query, params)
{
    params = params || [];
    return _toPromiseWhenOpen(function (resolve, reject) {
        db.run(query, params, function (error) {
            if (null === error) {
                resolve(this);
            } else {
                reject(error);
            }
        });
    });
};

var _toPromiseWhenOpen = function (func)
{
    return new Promise(function (resolve, reject) {
        if (db === null) {
            if (openPromise === null) {
                reject('The database is not open');
            } else {
                openPromise.then(function () {
                    func(resolve, reject);
                });
            }
        } else {
            func(resolve, reject);
        }
    });
};

export {
    open,
    getRegistries,
    getRegistryRows,
    insertRegistry,
    insertRow,
    close
};
