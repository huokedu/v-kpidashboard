'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const mock = process.argv.indexOf('--mock') >= 0;
const express = require(__dirname + '/../../server/node_modules/express');
const esession = require(__dirname + '/../../server/node_modules/cookie-session');
const logger = require(__dirname + '/../../server/node_modules/morgan');
const bodyParser = require(__dirname + '/../../server/node_modules/body-parser');
const passport = require(__dirname + '/../../server/node_modules/passport');
const ensure = require(__dirname + '/../../server/node_modules/connect-ensure-login');
const sauthPassport = require(__dirname + '/../../server/auth/sauth.passport');
const appsettings = require(__dirname + '/../../server/appsettings.json');
const mockroutes = require(__dirname + '/../mock/routes');

const opn = require('opn')
const path = require('path')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production')
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)
const devMiddleware = require('webpack-dev-middleware')(compiler, { publicPath: webpackConfig.output.publicPath, quiet: false, stats: { colors: true, modules: false, children: false, chunks: false, chunkModules: false } });
const hotMiddleware = require('webpack-hot-middleware')(compiler, { log: console.log, heartbeat: 2000 });
const page = require(__dirname + '/../../server/routes/page');

app.use(logger('dev', { skip: function (req, res) { return res.statusCode < 400; } }));
app.use(esession({ maxAge: 60 * 60 * 1000, secret: 'slb dls' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var configuration = appsettings['Consul'];
Object.keys(appsettings['Keyvault']).forEach((key) => configuration[key] = appsettings['Keyvault'][key]);

var checkAuth = (req, res, next) => next();
if (!mock) {
  sauthPassport(app, passport, configuration);
  app.use('/api/*', (req, res, next) => { req.appconfig = configuration; next(); });
  app.use(require(__dirname + '/../../server/routes/api'));
  checkAuth = ensure.ensureLoggedIn({ redirectTo: '/signon?' + Date.now(), setReturnTo: true });
} else {
  app.use(mockroutes);
}
// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// rewrite page route to locate it in memory files
page.pageRoutes.forEach(function (route) {
  app.get(route, checkAuth, (req, res, next) => {  res.set('Cache-Control', 'no-cache, no-store'); req.url = '/index.html'; next(); });
});

app.get('/credits', checkAuth, (req, res, next) => {  res.set('Cache-Control', 'no-cache, no-store'); req.url = '/credits.html'; next(); });

// serve webpack bundle output
app.use(devMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port;
    var wellid = process.env.RHAPSODY_DEBUG_TEST_WELLID || '';
    var qparam = wellid ? '?wellID=' + wellid + '&wellboreID=00000000-0000-0000-0000-000000000000' : '';
    var uri = 'http://localhost:' + port + qparam;
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
