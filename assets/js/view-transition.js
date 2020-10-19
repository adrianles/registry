console.debug('module view-transition.js is loading');

const htmlClassActiveView = 'active-view';
const htmlClassView = 'view';

var _findActiveView = function ()
{
    return document.body.querySelector('.' + htmlClassView + '.' + htmlClassActiveView);
};

var _hideActiveView = function ()
{
    var activeView = _findActiveView();
    if (activeView) {
        activeView.classList.remove(htmlClassActiveView);
    }
};

var _showView = function (view)
{
    view.classList.add(htmlClassActiveView);
};

var transitionTo = function (viewId)
{
    var view = document.getElementById(viewId);
    if (view) {
        _hideActiveView();
        _showView(view);
    } else {
        console.warn('No views with the give ID (' + viewId + ') were found');
    }
};

export {
    transitionTo
};
