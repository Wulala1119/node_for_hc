var express = require('express')
    , router = express.Router()
    , querystring = require("querystring")
    , protocolParser = require("../protocol/protocolParser.js")
    , userManager = require('../middleware/user_manager/userManager.js')
    , facilityManager = require("../middleware/facility_manager/facilityManager.js");
//console.log("update");

router.get('/', function(req, res) {
    //console.log("count: " + req.session.count++ );
    //console.log("user_id: " + req.session.user['user_id']);
    //console.log("epires: " + req.session.cookie.expires );
    //console.log("maxAge: " + req.session.cookie.maxAge );
    //console.log(req.cookies);
    if( userManager.refreshSessionList(req) != -1 )   //update session list success
    {
        update(req,res);
    }
    else
    {
    
    }

});

function update(request,response)
{
    //console.log('update.........');
    //console.log(Date.now());
    facilityManager.getDeviceList(0
        , function(err,dev,req,res){
        var status = dev[1].status;
        var timeOn = new Date(Date.parse(status.autoOn.time));
        var timeOff = new Date(Date.parse(status.autoOff.time));
        if(err) console.log(err);
        response.writeHead(200, {   'Content-Type': 'application/json',
                                'Cache-Control': 'no-cache',
                                'Connection': 'keep-alive',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Credentials': 'true'
                            });
        response.end(JSON.stringify( {
            air_pv:status.parameter[2]
            , floor_pv:status.parameter[3]
            , air_sv:status.parameter[0]
            , floor_sv:status.parameter[1]
            , power: status.running
            , on_hour: timeOn.getHours()//status.autoOn.time.getHours();
            , on_min: timeOn.getMinutes()//local.getData(0,"on_min"),
            , off_hour: timeOff.getHours()//local.getData(0,"off_hour"),
            , off_min:  timeOff.getMinutes()//local.getData(0,"off_min"),
            , auto_on_ena : status.autoOn.enable
            , auto_off_ena : status.autoOff.enable
        }));
    }
    , request
    , response);
}

module.exports = router;