console.debug('module registry.js is loading')

import {
    getRegistryRows as dbGetRegistryRows,
    insertRow as dbInsertRow
} from './database.js';
import { transitionTo as transitionToView } from './view-transition.js';
import { showView as showRegistriesView } from './registries.js';
import { showView as showReportView } from './report.js';

const viewId = 'view-registry';
const htmlClassInvalidControl = 'is-invalid';

var currentRegistryId = null;
var registriesMenuItem = document.getElementById(viewId).querySelector('.menu-item[data-r-target="registries"]');
registriesMenuItem.addEventListener('click', function (event) {
    showRegistriesView();
});

var tbody = document.getElementById('data-rows');
var viewReportButton = document.getElementById('viewRegistryReport');
viewReportButton.addEventListener('click', function (event) {
    showReportView(currentRegistryId);
});
var addRowButton = document.getElementById('insertRowButton');
var productInput = document.getElementById('insertRowProductInput');
var quantityInput = document.getElementById('insertRowQuantityInput');
var amountInput = document.getElementById('insertRowAmountInput');
addRowButton.addEventListener('click', function (event) {
    var row = validateForm();
    if (row !== null) {
        dbInsertRow(row).then(function (rowId) {
            reloadTable();
            initializeForm();
        });
    }
});

var createTableRow = function (registryRow, pos)
{
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.scope = 'row';
    td.textContent = registryRow.product;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = registryRow.quantity;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = registryRow.amount.toFixed(2) + ' €';
    tr.appendChild(td);
    td = document.createElement('td');
    tr.appendChild(td);
    tbody.appendChild(tr);
};

var initializeForm = function ()
{
    productInput.value = null;
    productInput.classList.remove(htmlClassInvalidControl);
    quantityInput.value = null;
    quantityInput.classList.remove(htmlClassInvalidControl);
    amountInput.value = null;
    amountInput.classList.remove(htmlClassInvalidControl);
    productInput.focus();
};

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

var showView = function (registryId)
{
    currentRegistryId = registryId;
    initializeForm();
    reloadTable();
    transitionToView(viewId);
    productInput.focus();
};

var validateForm = function ()
{
    productInput.classList.remove(htmlClassInvalidControl);
    quantityInput.classList.remove(htmlClassInvalidControl);
    amountInput.classList.remove(htmlClassInvalidControl);
    if (quantityInput.value === '') {
        quantityInput.value = 0;
    }
    if (amountInput.value === '') {
        amountInput.value = 0;
    }
    var row = {
        registryId: currentRegistryId,
        product: productInput.value,
        quantity: Number(quantityInput.value),
        amount: Number(amountInput.value)
    }
    var error = false;
    if (row.product.length !== 10) {
        productInput.classList.add(htmlClassInvalidControl);
        if (!error) {
            productInput.focus();
        }
        error = true;
    }
    if (!Number.isInteger(row.quantity) || row.quantity < 0) {
        quantityInput.classList.add(htmlClassInvalidControl);
        if (!error) {
            quantityInput.focus();
        }
        error = true;
    }
    if (row.amount < 0) {
        amountInput.classList.add(htmlClassInvalidControl);
        if (!error) {
            amountInput.focus();
        }
        error = true;
    }
    return (!error) ? row : null;
};

export {
    showView
};
