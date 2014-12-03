var mongoose = require( 'mongoose' )
	, Room = mongoose.model( 'Room' )
	, Device = require( './deviceManager.js' )
	, Room = require( './roomManager.js' )
	;


console.log(Date());

/*
*function: initialize the database on the start up of the server
*input: none
*output: none
*/
var initDB = function(){
	//Room.add({'roomID':1,'name':'bed'});
	//Device.add(0,{'deviceID':0,'type':'light'});
	//Device.add(0,{'deviceID':1,'type':'light'});
	//Device.add(0,{'deviceID':3,'type':'light'});
	setTimeout(function(){
		var time1 = Date.now();
		/*Device.getList(0,function(err,devices){
			//console.log('getlist');
			Device.update(0,[	{'deviceID':0,'running':false}
								, {'deviceID':1,'running':true,'autoOn':{'enable':true,'time':Date.now()},'autoOff':{'enable':true,'time':Date.now()}} 
								, {'deviceID':3,'running':false,'parameter':[29,39]}
								, {'deviceID':0,'running':false,'parameter':[11,50]}
							],function(err,devices){
				//console.log(devices);
				//console.log("elapsed1: " + (Date.now()-time1) );
			});
		});/*
		Device.getList(0,function(err,devices){
			//console.log('getlist');
			Device.update(1,[	{'deviceID':0,'running':false}
									, {'deviceID':1,'running':true,'autoOn':{'enable':true,'time':Date()},'autoOff':{'enable':true,'time':Date()}} 
									,{'deviceID':3,'running':false,'parameter':[22,32]}
									,{'deviceID':3,'running':false,'parameter':[22,32]}
									,{'deviceID':3,'running':false,'parameter':[22,32]}
									,{'deviceID':3,'running':false,'parameter':[22,32]}
									,{'deviceID':3,'running':false,'parameter':[22,32]}
									,{'deviceID':3,'running':false,'parameter':[,200]}
								],function(err,devices){

					//console.log(devices);
					//onsole.log("elapsed2: " + (Date.now()-time1) );
			});
		});*/
		Device.getList(0,function(err,devices){
			//console.log('getlist');
			/*Device.update(1,[	{'deviceID':0,'running':false}
								, {'deviceID':1,'running':true,'autoOn':{'enable':true,'time':Date.now()},'autoOff':{'enable':true,'time':Date.now()}} 
								,{'deviceID':3,'running':false,'parameter':[23,33]}
							],function(err,devices){
				//console.log(devices);
				//console.log("elapsed3: " + (Date.now()-time1) );
			});*/
		});


	}, 3000);
}
initDB();		//action

//////////////operation on devices/////////
exports.addDevice = Device.add;
exports.removeDevice = Device.remove;
exports.modifyDevice = Device.modify;
exports.updateDevice = Device.update;
exports.getDevice = Device.get;
exports.getDeviceList = Device.getList;

///////////operation on rooms///////////
exports.addRoom = Room.add;
exports.removeRoom = Room.remove;
exports.modifyRoom = Room.modify;
exports.getRoom = Room.get;
exports.getRoomList = Room.getList;
