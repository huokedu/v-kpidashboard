var express = require('express');
var ensure = require('connect-ensure-login');

var pageRouter = express.Router();
var path = require('path');

var pageRoutes = [
    '/',
    '/performance',
    '/qcview',
    '/maestrofootage',
    '/kpitracker',
    '/alertcenter',
    '/holecondition',
    '/holecondition/*'
];

pageRoutes.forEach(function (route) {
    pageRouter.get(route, ensure.ensureLoggedIn({ redirectTo: '/signon', setReturnTo: true }), function (req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
});

pageRouter.get('/credits', ensure.ensureLoggedIn({ redirectTo: '/signon', setReturnTo: true }), function (req, res) {
    res.sendFile(path.join(__dirname, '../public/credits.html'));
});

pageRouter.post('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        res.send("<h2>You have been logged out.</h2>");
    });
});


pageRouter.pageRoutes = pageRoutes;
module.exports = pageRouter;