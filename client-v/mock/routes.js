const express = require(__dirname + '/../../server/node_modules/express');
const router = express.Router();
const path = require('path');
const mockdb = require('./data');
mockdb.appSettings.wellID = process.env.RHAPSODY_DEBUG_TEST_WELLID || '';

const reqGetUrlMap = {
    '/api/user': mockdb.user,
    '/api/appSettings': mockdb.appSettings,
    '/mock/alert/alerts': mockdb.alert,
    '/mock/well/*': mockdb.well,
    '/mock/target/*': mockdb.target,
    '/mock/footageprojection/projection': mockdb.projection,
    '/mock/kpireader/mkpis': mockdb.kpidata,
    // '/mock/drillingactivityreader/das/level2': mockdb.drillingactivity,
}

Object.keys(reqGetUrlMap).forEach(url => {
    router.get(url, function (req, res) {
        res.json(reqGetUrlMap[url]);
    });
});


const reqPostUrlMap = {
    '/mock/depthdata/2015/DepthData/GetBounds': mockdb.depthbound,
    '/mock/timedata/2015/TimeData/GetBounds': mockdb.timebound,
    '/mock/target/stand/filter': mockdb.standtarget,
    '/mock/timedata/2015/TimeData/GetLastValue': mockdb.lastvalue,
    '/mock/footageprojection/dailyperf': mockdb.dailyperf,
}

Object.keys(reqPostUrlMap).forEach(url => {
    router.post(url, function (req, res) {
        res.json(reqPostUrlMap[url]);
    });
});


router.post('/mock/timedata/2015/TimeData/getFromTo', function (req, res) {
    if (req.body.utcFrom == '2017-02-01T00:00:00.000Z') {
        return res.json(mockdb.planactual1);
    } else if (req.body.utcFrom == '2017-02-02T00:00:00.000Z') {
        return res.json(mockdb.planactual2);
    } else if (req.body.utcFrom == '2017-02-03T00:00:00.000Z') {
        return res.json(mockdb.planactual3);
    } else if (req.body.utcFrom == '2017-02-04T00:00:00.000Z') {
        return res.json(mockdb.planactual4);
    } else if (req.body.utcFrom == '2017-02-05T00:00:00.000Z') {
        return res.json(mockdb.planactual5);
    } else if (req.body.utcFrom == '2017-02-06T00:00:00.000Z') {
        return res.json(mockdb.planactual6);
    }
});

router.post('/mock/depthdata/2015/DepthData/GetFromToByTime', function (req, res) {
    if (req.body.utcFrom == '2017-02-06T01:08:27.000Z') {
        return res.json(mockdb.depthdata1);
    } else if (req.body.utcFrom == '2017-02-06T03:08:27.000Z') {
        return res.json(mockdb.depthdata2);
    } else if (req.body.utcFrom == '2017-02-06T05:08:27.000Z') {
        return res.json(mockdb.depthdata3);
    } else if (req.body.utcFrom == '2017-02-06T07:08:27.000Z') {
        return res.json(mockdb.depthdata4);
    }
});

router.get('/signalr/*', function (req, res) {
    return res.json({
        message: 'not support signalR'
    })
});

module.exports = router;