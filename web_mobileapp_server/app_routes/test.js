var express = require('express')
    , router = express.Router()
    , querystring = require("querystring")
    , protocolParser = require("../protocol/protocolParser.js")
    , user = require('../middleware/user_manager/userManager.js')
    , facilityManager = require("../middleware/facility_manager/facilityManager.js");
var fs = require('fs');
router.get('/', function(req, res) {
        update(req,res);
        (typeof(req.session.count)=='undefined') ? req.session.count = 0 : req.session.count++;
        console.log(req.session)
});


/* service: testing the client to server connection
 * inputs:
 * outputs:
 */
router.get('/connect',function(req,res) {
    res.writeHead(200, {    'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': 'true'
                });
    res.end(JSON.stringify( {
                state: true
            }));
});

router.post('/',function(req,res) {
        console.log(req.body);
        (typeof(req.session.count)=='undefined') ? req.session.count = 0 : req.session.count++;
        console.log(req.session);
        res.writeHead(200, {   'Content-Type': 'application/json',
                                'Cache-Control': 'no-cache',
                                'Connection': 'keep-alive',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Credentials': 'true'
                            });
        res.end(JSON.stringify( {
            res:456
        }));
});


module.exports = router;