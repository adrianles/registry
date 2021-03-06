console.debug('module main.js is loading')

import { open as dbOpen, close as dbClose } from './database.js';
import { setLocale } from './i18n.js';
import { showView as showRegistriesView } from './registries.js';

dbOpen();
window.addEventListener('unload', function (event) {
    dbClose();
});

setLocale('es');
showRegistriesView();
