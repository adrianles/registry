console.debug('module registries.js is loading')

import {
    insertRegistry as dbInsertRegistry
} from './database.js';

var tbody = document.getElementById('data-registries');
