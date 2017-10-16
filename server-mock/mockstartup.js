/**
 * description: server side framework(node+express)
 */
const path = require('path');
const nprequire = require('./mockrequire');
const express = nprequire('express');
const favicon = nprequire('serve-favicon');
const logger = nprequire('morgan');
const bodyParser = nprequire('body-parser');
const cookieParser = nprequire('cookie-parser');
const publicPath = path.join(__dirname, '../server', 'public');
const server = express();
const env = process.env.NODE_ENV || 'development';
server.locals.ENV = env;
server.DEBUG_MODE = (env == 'development');

server.use(favicon(publicPath + '/favicon.ico'));
server.use(logger('dev'));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// add routers
server.use(require('./mockroutes'));
server.use(express.static(path.join(publicPath)));

/// catch 404 and forward to error handlersad
server.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
server.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (err.status == 404) {
        res.status(404).send('404 Page Not found');
    }
    console.log(err.status + err.message + req.url);
    res.end();
});


server.set('port', process.env.PORT || 5000);

var spa = server.listen(server.get('port'), () =>
    console.log('server listening on port ' + spa.address().port)
);