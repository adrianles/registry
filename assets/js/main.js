console.debug('module main.js is loading')

import { open as dbOpen, close as dbClose } from './database.js';

dbOpen();
window.addEventListener('unload', function (event) {
    dbClose();
});
