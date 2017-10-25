var express = require('express');
var ensure = require('connect-ensure-login');
var path = require('path');
var svctoken = require('../auth/sauth.svctoken');
var stsbearer = require('../util/sts.bearer');
var data = require('../data');
var apiRouter = express.Router();
var serviceTokenCache = {};
var expiredseconds = 23 * 3600;

apiRouter.all('/api/*', ensure.ensureLoggedIn('/signon'));

apiRouter.get('/api/user', function (req, res) {
    res.json({
        'nameIdentifier': '',
        'name': req.user.givenName + ' ' + req.user.lastName,
        'roles': '',
        'upn': req.user.id,
        'utoken': req.user.utoken,
    });
});

apiRouter.get('/api/appSettings', function (req, res) {
    var config = req.appconfig;
    var delt = (Date.now() - req.user.date) / 1000;
    var reqlist = [stsbearer.fetch(config['STS-Endpoint'], req.user.id)]
    if (!(serviceTokenCache[req.user.id]) || delt >= expiredseconds) {
        var sToken = svctoken(config['SAuth-ServiceToken-Uri'], config['SAuth-ServiceToken-ApiKey']);
        reqlist.push(sToken.fetch({ uJwttoken: req.user.utoken, targetProjectId: '', targetServiceId: '' }))
    }

    Promise.all(reqlist)
        .then(arrRes => {
            serviceTokenCache[req.user.id] = arrRes[1] ? arrRes[1].svctoken : serviceTokenCache[req.user.id];
            res.json({
                'baseUrl': null,
                'debugWellID': process.env.RHAPSODY_DEBUG_TEST_WELLID || '',
                'alertApiURI': config['Uri-Slb.Prism.Core.Service.Alert-1'],
                'alertRhapsodyApiURI': config['Uri-Slb.Prism.Rhapsody.Service.Alert-1'],
                'alertPublisherURI': config['Uri-Slb.Prism.Core.Service.AlertPublisher-1'],
                'drillingActivityReaderURI': config['Uri-Slb.Prism.Rhapsody.Service.DrillingActivityReader-1'],
                'drillingActivityReaderURI': config['Uri-Slb.Prism.Rhapsody.Service.DrillingActivityReader-1'],
                'drillingApiDepthDataURI': config['Uri-Slb.Prism.RO.Service.DrillingApi.DepthData-1'],
                'drillingApiTimeDataURI': config['Uri-Slb.Prism.RO.Service.DrillingApi.TimeData-1'],
                'drillingStreamTimeDataURI': config['Uri-Slb.Prism.RO.Service.DrillingStream.TimeData-1'],
                'fedSts': config['STS-Endpoint'],
                'footageProjectionURI': config['Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1'],
                'jwtToken': arrRes[0].access_token,
                'kpiDataURI': config['Uri-Slb.Prism.Rhapsody.Service.KpiPublisher-1'],
                'kpiReaderURI': config['Uri-Slb.Prism.Rhapsody.Service.KpiReader-2'],
                'rhapsodyApiURI': config['Uri-Slb.Prism.Rhapsody.Service.RhapsodyApi-1'],
                'rhapsodycommandURI': config['Uri-Slb.Prism.Rhapsody.Service.Command-1'],
                'roDashboardURI': config['Uri-Slb.Prism.RO.View.Dashboard'],
                'zeusDashboardURI': config['Uri-Slb.Prism.Zeus.View.WebComponents'],
                'rhapsodyDashboardURI': config['Uri-Slb.Prism.Rhapsody.View.Dashboard'],
                'serviceToken': serviceTokenCache[req.user.id],
                'targetsURI': config['Uri-Slb.Prism.Rhapsody.Service.Targets-2'],
                'wellURI': config['Uri-Slb.Prism.Core.Service.Well-1']
            });
        })
        .catch(e => console.log(e));
});

apiRouter.get('/api/hcm/timeplot', function (req, res) {
    res.json(data.timeplot);
});
module.exports = apiRouter;