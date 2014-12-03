var express = require('express')
    , client = require("../tcpclient/tcpClient.js")
    , protocol = require("../protocol/protocol.js")
    , protocolParser = require("../protocol/protocolParser.js")
   // , local = require("../local/local.js")
    , task_manager = require("../middleware/task_manager/taskManager.js")
    , facilityManager = require("../middleware/facility_manager/facilityManager.js")
    , user = require('../middleware/user_manager/userManager.js');

var router = express.Router();
var connection_status = false;

/*
console.log( protocolParser.setTemperature(0, protocol.cmd1('AIR_TEMP_SV'),10) )
console.log( protocolParser.setTemperature(0, protocol.cmd1('FLOOR_TEMP_SV'),110) )
console.log( protocolParser.setAutoON(0,1,15,15) );
console.log( protocolParser.setAutoOFF(1,1,15,15) );
console.log( protocolParser.powerOn(1) );
*/

//URL for connect command
router.post('/', function(req, res) {
    if( user.refreshSessionList(req) != -1 )   //update session list success
    {
	   connectTCPClient(req, res);
    }
});

//URL for controllers update request
router.get('/status', function(req,res) {
    if( user.refreshSessionList(req) != -1 )   //update session list success
    {
        console.log('update server status......... ' + connection_status);
        res.writeHead(200, {        'Content-Type': 'application/json',
                                        'Cache-Control': 'no-cache',
                                        'Connection': 'keep-alive',
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Credentials': 'true'
                                    });
        res.end(JSON.stringify( {
                status:connection_status
        }));
    }
});

//URL for set device parameter
router.post('/setdevice', function(req,res) {
    if( user.refreshSessionList(req) != -1 )   //update session list success
    {
        if(connection_status==true)
        {
            setDevice(req,res);
        }
        else
        {
            console.log("connection is down, unable to reach device...");
        }
    }
});

//URL for auto on mode settings
router.post('/setautoon',function(req,res) {
    if( user.refreshSessionList(req) != -1 )   //update session list success
    {
        if(connection_status==true)
        {
            setAutoMode(0,req,res);
        }
        else
        {
            console.log("connection is down, unable to reach device...");
        }
    }
});

//URL for auto off mode settings
router.post('/setautooff',function(req,res) {
    if( user.refreshSessionList(req) != -1 )   //update session list success
    {
        if(connection_status==true)
        {
            setAutoMode(1,req,res);
        }
        else
        {
            console.log("connection is down, unable to reach device...");
        }
    }
});

//URL for power switch
router.post('/power',function(req,res) {
    if( user.refreshSessionList(req) != -1 )   //update session list success
    {
        if(connection_status==true)
        {
            setPower(req,res);
        }
        else
        {
            console.log("connection is down, unable to reach device...");
        }
    }
});


/* function: connect to controller
* input: 
* output: none
*/
function connectTCPClient(request,response)
{
    var ip;
    var port;

    ip = request.body.ip;
    port =request.body.port;
    if( !connection_status )
    {
        console.log("new IP: " + ip);
        console.log("new port: " + port);
        console.log("connecting server...");
        client.connectToServer(ip,port);
        //client.readBy(local,processData);
        client.readBy(processData);
        client.onConnect(connectProcess);
        client.onClose(closeProcess);
    }
    else
    {
        //console.log("connection is already established!");
        console.log("abort old connection...");
        console.log("setting up new connection...");        
        client.connectToServer(ip,port);
        //client.readBy(local,processData);
        client.readBy(processData);
        client.onConnect(connectProcess);
        client.onClose(closeProcess);
    }
    response.end();
    //printSth();
}


/* function:
* input: 
* output:
*/
function setDevice(request,response){
    
    //console.log(protocolParser.setTemperature(0, protocol.cmd1('AIR_TEMP_SV'),request.body.air_sv));
    client.send(protocolParser.setTemperature(0, protocol.cmd1('AIR_TEMP_SV'),request.body.air_sv));
    client.send(protocolParser.setTemperature(0, protocol.cmd1('FLOOR_TEMP_SV'),request.body.floor_sv));
    response.end();
}


/* function:
* input: 
* output:
*/
function processData(data)
{
    console.log("recieved: " + data);
    //update_flag = true;
    protocolParser.parseIncomingData(data);
}


/* function:
* input: 
* output:
*/
function connectProcess()
{
    connection_status = true;
    console.log("connect to server successfully!" + connection_status);
    client.send("hello server!!!");
}


/* function:
* input: 
* output:
*/
function closeProcess(had_error)
{
    console.log("connetion closing...");
    connection_status = false;
    if(had_error)
    {
        console.log("connetion closed due to socket error...");
    }
    else
    {
        console.log("connection down...");
    }
}


/* function:
* input: 
* output:
*/
function getConnectionStatus()
{
    return connection_status;
}


/* function:
* input: 
* output:
*/
function setAutoMode(mode,request,response)
{
    var ena = request.body.enable;
    var time = String(request.body.time);
    var hour,min;
    var m_index = time.indexOf(':');
    hour = Number(time.substring(0,m_index));
    min = Number(time.substring(m_index+1));

    console.log(hour);
    console.log(min);
    if(mode == 0)       //auto-on mode
    {
        //console.log(protocolParser.setAutoON(0,ena,hour,min));
        client.send(protocolParser.setAutoON(0,ena,hour,min));
    }
    else if(mode == 1)  //auto-off mode
    {   
        //console.log(protocolParser.setAutoOFF(0,ena,hour,min));
        client.send(protocolParser.setAutoOFF(0,ena,hour,min));
        
    }
    response.end();
}


/* function:
* input: 
* output:
*/
function setPower(request,response)
{
    var opt = request.body.opt;
    if(opt == 1)
    {
        client.send(protocolParser.powerOn(0));
    }
    else if(opt == 0)
    {
        client.send(protocolParser.powerOff(0));
    }
    response.end();
}



module.exports = router;

//console.log(protocolParser.setTemperature(0, protocol.cmd1('AIR_TEMP_SV'),100));
