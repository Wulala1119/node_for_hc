var mongoose = require( 'mongoose' )
	, Room = mongoose.model( 'Room' );

/*
function RoomCache() {
	this.room = null;		//store the room entity
	this.wr_locker = false;	//when user is changing the room cache, lock it
	this.condition = 0;		//user of the room cache
}
RoomCache.prototype = {
	con: function(){
		return this.condition;
	},
	use: function(){
		this.condition++;
		//console.log("condition++: " + this.condition);
	},
	release: function(){
		this.condition--;
		if(this.condition<0) this.condition = 0;
		//console.log("condition--: " + this.condition);
	},
	wr: function(){
		return this.wr_locker;
	},
	wrLock: function(){
		if(this.condition > 0) return false;
		if( this.wr_locker == true ) return false;
		this.wr_locker = true;
		return true;

	},
	wrUnlock: function(){
		if(this.condition > 0) return;
		this.wr_locker = false;
	},
	setRoom: function(room){
		if(this.condition > 0) return;
		if( this.wr_locker && this.condition == 0)
		{
			if(this.room==null || this.room.roomID != room.roomID)
			{
				//console.log('set new room..............');
				this.room = room;
				//console.log(this.room);
			}
		}
	}
}
var room_cache = new RoomCache();
*/

/*
* function: add new device to the database
* input: Number room_id,
* 		 Array device_info,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.add = function(room_id, dev_info, callback, req, res) {

	/*if( room_cache.room != null && room_cache.room.roomID == room_id)
	{
		room_cache.use();		//if its in the cacahe, lock the cache
		var room =room_cache.room;
		if( isDeviceExisted(dev_info['deviceID'],room.devices) )
		{
			console.log('deviceID duplicate error');
			return;
		}
		room.devices.push(dev_info);
		room.save(function(err,device){
			if(typeof(callback) != 'undefined') callback(err, device, req, res);
		});
		room_cache.release();
		return;
	}*/

	Room.findOne({'roomID':room_id}		//check if it's already existed
			,null
			,function(err,room){
				if(room==null)
				{
					console.log('deviceManager: add device error -- room not exist');
					return;
				}

				if( isDeviceExisted(dev_info['deviceID'],room.devices) )
				{
					console.log('deviceID duplicate error');
					return;
				}

				/*if( room_cache.wrLock() )	//renew the room cache
				{
					room_cache.setRoom(room);
					room_cache.wrUnlock();
				}*/

				room.devices.push(dev_info);
				room.save(function(err,device){
					//console.log(err);
					if(typeof(callback) != 'undefined') callback(err, device, req, res);
				});
			}
	);
}


/*
* function: delete a specific device to the database
* input: Number dev_id,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.remove = function(room_id, dev_id, callback, req, res) {
/*	if( room_cache.room != null && room_cache.room.roomID == room_id)
	{
		room_cache.use();		//if its in the cacahe, lock the cache
		var room =room_cache.room;
		
		for (var i in room.devices)
		{
			if(room.devices[i].deviceID == dev_id)
			{
				room.devices.splice(i,1);
			}
		}
		room.save(function(err,room){
			if(typeof(callback) != 'undefined') callback(err, room, req, res);
		});
		room_cache.release();
		return;
	}*/

	Room.findOne({'roomID':room_id}		//check if it's already existed
			,null
			,function(err,room){
				if(room==null)
				{
					console.log('deviceManager: access deviceslist error -- room not exist');
					return;
				}
				for (var i in room.devices)
				{
					if(room.devices[i].deviceID == dev_id)
					{
						room.devices.splice(i,1);
					}
				}
				room.save(function(err,room){
					//console.log(err);
					if(typeof(callback) != 'undefined') callback(err, room, req, res);
				});

				/*if( room_cache.wrLock() )		//renew the room cache
				{
					room_cache.setRoom(room);
					room_cache.wrUnlock();
				}*/
			}
	);
}


/*
* function: modify a specific device in the database
* input: Number room_id,
*		 Array device_info,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.modify = function(room_id, device_info, callback, req, res) {
	/*if( room_cache.room != null && room_cache.room.roomID == room_id)
	{
		room_cache.use();		//if its in the cacahe, lock the cache
		var room =room_cache.room;
		//do something
		room_cache.release();
		return;
	}*/
	Room.findOne({'roomID':room_id}		//check if it's already existed
			,null
			,function(err,room){
				if(room==null)
				{
					console.log('deviceManager: access deviceslist error -- room not exist');
					return;
				}
				//do something
			}
	);
}


/*
* function: update a specific device in the database
* input: Number room_id,
*		 Array dev_status,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.update = function(room_id, new_status, callback, req, res) {
	//console.log("room_id  :" + room_id);
	//console.log(new_status);
	/*if( room_cache.room != null && room_cache.room.roomID == room_id)
	{
		room_cache.use();		//if its in the cacahe, lock the cache
		var room =room_cache.room;
		//do something
		var devices = room.devices;
		updateStatus(devices, new_status);		//update the entity
		room.save(function(err,room){				//save to the database
			if( room_cache.wrLock() )			//renew the room cache
			{
				room_cache.setRoom(room);
				room_cache.wrUnlock();
			}
			if(typeof(callback) != 'undefined') callback(err, devices, req, res);
		});
		room_cache.release();
		return;
	}*/

	Room.findOne({'roomID':room_id}		//check if it's already existed
			,null
			,function(err,room){
				if(room==null)
				{
					console.log('deviceManager: access deviceslist error -- room not exist');
					return;
				}
				//do something
				var devices = room.devices;
				updateStatus(devices, new_status);	//update the entity
				room.save(function(err,room){			//save to the database
					if(typeof(callback) != 'undefined') callback(err, devices, req, res);
				});
			}
	);
}

/*
* function: update the status of the devices
* input: Array devices, devices list to update, it's the array of the entity
* 		 Array new_status, new status of the devices
* output: none
*/
function updateStatus(devices, new_status)
{
	for (var i in new_status )			//for each status
	{
		for(var j in devices)			//look for the match ID
		{
			if( devices[j].deviceID == new_status[i].deviceID )
			{
				var status = devices[j].status;		//access the status array			
				//running status
				status.running = typeof(new_status[i].running) ? new_status[i].running : status.running;
				//auto on mode settings
				if( typeof(new_status[i].autoOn) != 'undefined' )
				{
					status.autoOn.enable = typeof(new_status[i].autoOn.enable) ? new_status[i].autoOn.enable : status.autoOn.enable;
					status.autoOn.time = typeof(new_status[i].autoOn.time) ? new_status[i].autoOn.time : status.autoOn.time;
				}
				//auto off mode settings
				if( typeof(new_status[i].autoOff) != 'undefined' )
				{
					status.autoOff.enable = typeof(new_status[i].autoOff.enable) ? new_status[i].autoOff.enable : status.autoOff.enable;
					status.autoOff.time = typeof(new_status[i].autoOff.time) ? new_status[i].autoOff.time : status.autoOff.time;
				}
				//parameter of the device
				if(typeof(new_status[i].parameter)!='undefined')
				{
					var para = new Array();
					para = para.concat(new_status[i].parameter);
					//console.log(para.length);
					for( var k=0; k < para.length; k++ )
					{
						para[k] = (para[k] != null) ? para[k]  : status.parameter[k] ;
					}
					status.parameter = para;
					//console.log(status.parameter);
				}
				break;		//get out of the inner loop
			}
		}
	}
}


/*
* function: read a specific device in the database
* input: Number dev_id,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.get = function(room_id, dev_id, callback, req, res) {
	//since the devices is ognazied room by room, the operation should also be implenmente on devices list level,
	//hence, getting device one by one is not necessary in this case
}


/*
* function: modify a specific device to the database
* input: Number room_id,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.getList = function(room_id, callback, req, res) {
	var devices;
	var err;
	/*if( room_cache.room != null && room_cache.room.roomID == room_id)
	{
		room_cache.use();		//if its in the cacahe, lock the cache
		devices = room_cache.room.devices;
		if(typeof(callback) != 'undefined') callback(err, devices, req, res);
		room_cache.release();
		return;
	}*/

	Room.findOne({'roomID':room_id}		//check if it's already existed
			,null
			,function(err,room){
				if(room==null)
				{
					console.log('deviceManager: access deviceslist error -- room not exist');
					return;
				}
				devices = room.devices;	//access the devices list
				if(typeof(callback) != 'undefined') callback(err, devices, req, res);

				/*if( room_cache.wrLock() )
				{
					room_cache.setRoom(room);
					room_cache.wrUnlock();
				}*/
			}
	);
}



/*
* function: check if the device exists in the database
* input: Number dev_id,
* 		 Array  devices,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
function isDeviceExisted(dev_id, devices) {
	for (var i in devices)
	{
		if(devices[i].deviceID == dev_id)
		{
			return 1;
		}
	}
	return 0;
}