/**
 * description: server side framework(node+express)
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var sts = require('strict-transport-security');
var sauthPassport = require('./auth/sauth.passport');
var appsettings = require('./appsettings.json');
appsettings.ConsulUri = process.env.ConsulUri || appsettings.ConsulUri;
appsettings.Environment = process.env.Environment || appsettings.Environment;
var consul = require('./util/consul')(appsettings);

var publicPath = path.join(__dirname, 'public');
var server = express();
var env = process.env.NODE_ENV || 'development';
server.locals.ENV = env;
server.DEBUG_MODE = (env == 'development');

//server.use(require('compression')()) // must be first!

server.disable('x-powered-by');
server.disable('server');
server.use(favicon(publicPath + '/favicon.ico'));
server.use(logger('dev'));
if (server.DEBUG_MODE) {
    server.use(require('express-session')({ secret: 'slb dls', resave: false, saveUninitialized: false }));
} else {
    server.use(require('express-session')({ secret: 'slb dls', resave: false, saveUninitialized: false, proxy: true, cookie: { secure: true } }));
}
server.use(sts.getSTS({ 'max-age': { days: 30 } }));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var startup = (configuration) => {
    // init SAuth
    sauthPassport(server, passport, configuration);

    // pass config to api route
    server.use('/api/*', (req, res, next) => { req.appconfig = configuration; next(); });

    // add routers
    server.use(require('./routes/api'));
    server.use(require('./routes/page'));
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
}

if (server.DEBUG_MODE) {
    var config = appsettings['Consul'];
    Object.keys(appsettings['Keyvault']).forEach((key) => config[key] = appsettings['Keyvault'][key]);
    startup(config);
} else {
    consul.get(Object.keys(appsettings['Consul'])).then((config) => {
        var keyvault = require('./util/keyvault')(config['KeyVault-ClientId'], config['KeyVault-ClientSecret'], config['KeyVault-Uri']);
        var keyvaultKeys = Object.keys(appsettings['Keyvault']).map(key => appsettings.Environment + '-' + key);
        keyvault.getSecrets(keyvaultKeys)
            .then(result => {
                keyvaultKeys.forEach((key, idx) => config[key.replace(appsettings.Environment + '-', '')] = result[idx].value);
                startup(config);
            }).catch(e => console.log(e));
    }).catch(e => console.log(e));
}