console.debug('module registries.js is loading')

import {
    getRegistries as dbGetRegistries,
    insertRegistry as dbInsertRegistry
} from './database.js';
import { transitionTo as transitionToView } from './view-transition.js';
import { showView as showRegistryView } from './registry.js';

const viewId = 'view-registries';
const htmlClassClickable = 'clickable';

var tbody = document.getElementById('data-registries');
var button = document.getElementById('insertRegistryButton');
var input = document.getElementById('insertRegistryInput');
button.addEventListener('click', function (event) {
    var name = input.value;
    dbInsertRegistry(input.value).then(function (registryId) {
        reloadTable();
        input.value = null;
    });
});

var reloadTable = function ()
{
    dbGetRegistries().then(function (registries) {
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        for (var i = 0; i < registries.length; i++) {
            createTableRow(registries[i]);
        }
    });
};

var createTableRow = function (registry)
{
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.scope = 'row';
    td.textContent = registry.id;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = registry.name;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = registry.creationDate;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = registry.modificationDate;
    tr.appendChild(td);
    tr.classList.add(htmlClassClickable);
    tr.addEventListener('click', function (event) {
        onTableRowClickEvent(event, registry.id);
    });
    tbody.appendChild(tr);
};

var onTableRowClickEvent = function (event, registryId)
{
    showRegistryView(registryId);
};

var showView = function ()
{
    reloadTable();
    transitionToView(viewId);
};

export {
    showView
};
