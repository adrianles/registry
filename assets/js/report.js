console.debug('module report.js is loading')

import { getRegistryRows as dbGetRegistryRows } from './database.js';
import { transitionTo as transitionToView } from './view-transition.js';
import { showView as showRegistriesView } from './registries.js';
import { showView as showRegistryView } from './registry.js';

const viewId = 'view-report';

var currentRegistryId = null;
var registriesMenuItem = document.getElementById(viewId).querySelector('.menu-item[data-r-target="registries"]');
registriesMenuItem.addEventListener('click', function (event) {
    showRegistriesView();
});
var registryMenuItem = document.getElementById(viewId).querySelector('.menu-item[data-r-target="registry"]');
registryMenuItem.addEventListener('click', function (event) {
    showRegistryView(currentRegistryId);
});

var tbody = document.getElementById('data-report-rows');

var reloadTable = function ()
{
    dbGetRegistryRows(currentRegistryId).then(function (rows) {
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        var reportRows = {};
        for (var i = 0; i < rows.length; i++) {
            if (!reportRows[rows[i].product]) {
                reportRows[rows[i].product] = {
                    product: rows[i].product,
                    appearances: 0,
                    totalQuantity: 0,
                    totalAmount: 0
                };
            }
            reportRows[rows[i].product].appearances++;
            reportRows[rows[i].product].totalQuantity += rows[i].quantity;
            reportRows[rows[i].product].totalAmount += rows[i].amount;
        }
        Object.values(reportRows).forEach(createTableRow);
    });
};

var createTableRow = function (reportRow)
{
    var tr = document.createElement('tr');
    var td = document.createElement('td', {scope: 'row'});
    td.textContent = reportRow.product;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = reportRow.appearances;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = reportRow.totalQuantity;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = reportRow.totalAmount + ' €';
    tr.appendChild(td);
    tbody.appendChild(tr);
};

var showView = function (registryId)
{
    currentRegistryId = registryId;
    reloadTable();
    transitionToView(viewId);
};

export {
    showView
};
