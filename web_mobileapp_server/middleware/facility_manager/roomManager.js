var mongoose = require( 'mongoose' )
	, Room = mongoose.model( 'Room' );

/*
* function: add new room to the database
* input: Array room_info,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.add = function(room_info, callback, req, res)
{
	if( typeof(room_info['roomID']) == 'undefined' )
	{
		console.log("roomManager: error, undefined roomID");
		return;
	} 	
	
	Room.findOne(	{'roomID':room_info['roomID']}		//check if it's already existed
					,null
					,function(err,room){
						//console.log(room);
						if(room != null)				//roomID exists
						{
							console.log('roomManager:' + room.roomID + " already exists, name: " + room.name);
						}
						else 							//create new room
						{
							if(typeof(room_info['name']) == 'undefined' )
							{
								room_info['name'] = "undefined"
							}

							Room.create({
								roomID: room_info['roomID'],
								name: room_info['name']
								},
								function(err, room){
									//console.log('roomManager: new room created');
									if(typeof(callback) != 'undefined') callback(err, room, req, res);
								}
							);
						}
					}
				);
}


/*
* function: delete a specific room from the database
* input: Number room_id,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.remove = function(room_id, callback, req, res)
{

}


/*
* function: modify room info in the database
* input: Array room_info,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.modify = function(room_info, callback, req, res)
{

}


/*
* function: read a specific room in the database
* input: Number room_id,
*		 function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.get = function(room_id, callback, req, res)
{
	Room.findOne({'roomID':room_info['roomID']}		//check if it's already existed
			,null
			,function(err,room){
				if(typeof(callback) != 'undefined') callback(err, room, req, res);
			}
		);
}


/*
* function: return the room list in the database
* input: function callback,
*		 HttpRequest req,
*		 HttpResponse res,
* output: none
*/
exports.getList = function(callback, req, res)
{

}