console.debug('module registries.js is loading')

import {
    deleteRegistry as dbDeleteRegistry,
    getRegistries as dbGetRegistries,
    insertRegistry as dbInsertRegistry
} from './database.js';
import { transitionTo as transitionToView } from './view-transition.js';
import { showView as showRegistryView } from './registry.js';
import { translate } from './i18n.js';

const viewId = 'view-registries';
const htmlClassIcon = 'icon';
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

var deleteLock = false;

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
    td = document.createElement('td');
    td.classList.add('col-auto');
    var icon = document.createElement('img');
    icon.classList.add(htmlClassIcon);
    icon.classList.add(htmlClassClickable);
    icon.setAttribute('src', 'assets/img/rubbish-bin.png');
    icon.addEventListener('click', function (event) {
        if (!deleteLock) {
            if (confirm(translate('Are you sure you want to delete this registry?'))) {
                deleteLock = true;
                dbDeleteRegistry(registry.id).then(function () {
                    tbody.removeChild(tr);
                    deleteLock = false;
                });
            }
        }
        event.stopPropagation();
    });
    td.appendChild(icon);
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
