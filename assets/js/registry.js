console.debug('module registry.js is loading')

import {
    getRegistryRows as dbGetRegistryRows,
    insertRow as dbInsertRow
} from './database.js';
import { transitionTo as transitionToView } from './view-transition.js';
import { showView as showRegistriesView } from './registries.js';

const viewId = 'view-registry';

var registriesMenuItem = document.getElementById(viewId).querySelector('.menu-item[data-r-target="registries"]');
registriesMenuItem.addEventListener('click', function (event) {
    showRegistriesView();
});

var tbody = document.getElementById('data-rows');
var button = document.getElementById('insertRowButton');
var productInput = document.getElementById('insertRowProductInput');
var quantityInput = document.getElementById('insertRowQuantityInput');
var amountInput = document.getElementById('insertRowAmountInput');
var currentRegistryId = null;
button.addEventListener('click', function (event) {
    var row = {
        registryId: currentRegistryId,
        product: productInput.value,
        quantity: quantityInput.value,
        amount: amountInput.value
    }
    //TODO: validation for quantity and amount
    dbInsertRow(row).then(function (rowId) {
        reloadTable();
        productInput.value = null;
        quantityInput.value = null;
        amountInput.value = null;
        productInput.focus();
    });
});

var reloadTable = function ()
{
    dbGetRegistryRows(currentRegistryId).then(function (rows) {
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        for (var i = 0; i < rows.length; i++) {
            createTableRow(rows[i]);
        }
    });
};

var createTableRow = function (registryRow, pos)
{
    var tr = document.createElement('tr');
    var td = document.createElement('td', {scope: 'row'});
    td.textContent = registryRow.product;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = registryRow.quantity;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = registryRow.amount + ' €';
    tr.appendChild(td);
    td = document.createElement('td');
    tr.appendChild(td);
    tbody.appendChild(tr);
};

var showView = function (registryId)
{
    currentRegistryId = registryId;
    reloadTable();
    transitionToView(viewId);
    productInput.focus();
};

export {
    showView
};
