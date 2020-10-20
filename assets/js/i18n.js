console.debug('module i18n.js is loading');

import { translations as enTranslations } from './locale/en.js';
import { translations as esTranslations } from './locale/es.js';

const htmlAttrTranslations = 'data-r-i18n';

var _locale = null;
var _translations = {
    en: enTranslations,
    es: esTranslations
}

var getLocale = function ()
{
    return _locale;
};

var setLocale = function (locale)
{
    _locale = locale;
    _updateDom();
};

var translate = function (label)
{
    return (_translations[_locale][label]) ? _translations[_locale][label] : label;
};

var _updateDom = function ()
{
    document.body.querySelectorAll('[' + htmlAttrTranslations + ']').forEach(function (node) {
        node.textContent = translate(node.getAttribute(htmlAttrTranslations));
    });
};

setLocale('en');

export {
    getLocale,
    translate,
    setLocale
};
