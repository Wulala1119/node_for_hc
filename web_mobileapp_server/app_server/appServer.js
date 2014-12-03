var net = require('net');
var protocol = require("../protocol/protocol.js");
var protocolParser = require("../protocol/protocolParser.js");
var local = require("../local/local.js");


var HOST = '192.168.1.247';
var PORT = 4000;
var update_interval = 5;		//second
var tcp_server;
var client = {};

function createAppServer(port)
{
	PORT = port||PORT;
	tcp_server = net.createServer( function() {
		console.log("app server created...");
	});
	tcp_server.listen(PORT);
	setInterval(update,update_interval*1000);			//update the client periodly



	tcp_server.on("connection",function(socket){
		socket.setTimeout(10*1000,function(){
			console.log(socket.key+" is down...");
			//client = deleteByElement(client,socket);

			delete client[socket.key];
		})
		socket.on("close",function(had_err) {
			console.log(socket.key+" is down...");
			//client = deleteByElement(client,socket);

			delete client[socket.key];
		})

		socket.key = socket.remoteAddress + ":" + socket.remotePort;
		console.log("new client:" + socket.key);
		client[socket.key] = socket;
		//console.log(client);
		//client.push(socket);;
		update();
	});
}

function update()
{
    var buffer;
    var list = new Array();
 
    list.push( protocolParser.setTemperature(0, protocol.cmd1('AIR_TEMP_SV'),local.getData(0,"air_sv")) );
    list.push( protocolParser.setTemperature(0, protocol.cmd1('AIR_TEMP_PV'),local.getData(0,"air_pv")) );
    list.push( protocolParser.setTemperature(0, protocol.cmd1('FLOOR_TEMP_SV'),local.getData(0,"floor_sv")) );
    list.push( protocolParser.setTemperature(0, protocol.cmd1('FLOOR_TEMP_PV'),local.getData(0,"floor_pv")) );


    buffer = Buffer.concat(list);

    for(var key in client){
    	client[key].write(buffer);
    }
}

function deleteByElement(arr,ele)
{
	if(!Array.isArray(arr)){
		console.log("not an array cannot delete by element...");
		return;
	}
	var index = arr.indexOf(ele);
	return deleteByIndex(arr,index);
}

function deleteByIndex(arr,index)
{
	var new_arr = new Array();
	if(!Array.isArray(arr)){
		return new_arr;
	}
	for(var i=0;i<arr.length;i++)
	{
		if(i!=index)
		{
			new_arr.push(arr[i]);
		}
	}
	return new_arr;
}
exports.createAppServer = createAppServer;