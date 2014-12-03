var net = require('net');
var HOST = '192.168.1.247';
var PORT = 8080;
var client = new net.Socket();

function connectToServer(ip,port)
{
	HOST = ip;
	PORT = port;
	client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
    //client.write('Hello world!!');
    //client.write(tmp);
    });
}

function reconnect()
{
	client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
    });
}

function close()
{
    client.destroy();
}

function send(temp)
{
	client.write(temp);
}

function readBy(callbackFunction)
{
	client.on('data',function(data){
		callbackFunction(data);
	});
}
function onConnect(callbackFunction)
{
    client.on('connect',function(){
        callbackFunction();
    });
}

function onClose(callbackFunction)
{
	client.on('close',function(had_error){
        callbackFunction(had_error);
    });
}

exports.connectToServer = connectToServer;
exports.reconnect = reconnect;
exports.send = send;
exports.readBy = readBy;
exports.onClose = onClose;
exports.onConnect = onConnect;