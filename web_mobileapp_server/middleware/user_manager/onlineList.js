var util = require('util')								//module to emit signals
	, EventEmitter = require('events').EventEmitter;


/*
*	Expired client checking timer
*/
var Ticker = function() {			//timer to check on clients' expirations
	var self = this;

	setInterval(function(){				//setting global interval action
		var now = Date.now();			//acess the current date
		var expiredList = new Array();	//to store the expired client

		for(var key in clients){		//first thing is to find out all expired client
			if(clients[key].expires <= now)		//expired
			{
				expiredList.push(key);			//saving the clients index
			}
		}

		/*reasons of removing expired clients from the back to the front
		*  if remove from the front, the list will be shorten and the key from the back
		* will be shift up, so the key stored in the back of the expiredList will be valid,
		* in this case, even multiple expired clients are spotted, only the first one in the
		* expiredList will be removed. 
		*/
		for(var i=expiredList.length-1; i >= 0; i--)	//remove the clients backwards
		{
			self.emit('logout',clients[expiredList[i]].id);	//emit a logout sig with the user id
			clients.splice(expiredList[i], 1);				//remove the specific client
		}

	},10*1000);				//interval value: ms
}
util.inherits(Ticker, EventEmitter);	//setting up the ticker

/*
*	User Class
*/
function User(user_id, date) {			//user class to store user id and expiration date
	this.id = user_id;
	this.expires = date;
}

User.prototype = {						//method for User Class
	resetExpires: function(date)		//reset the expiration date
	{
		this.expires = date;
	}
}


var clients = new Array();		//online client list
var ticker = new Ticker();		//expired client checking timer


/*
*function: look for the index of a client by it's name
*input: String user_id  
*output: index of the client, -1 = cannot find
*/
getClientIndex = function(user_id) {
	for(var key in clients){			//look up by each key
		if(clients[key].id == user_id)
		{
			return key;
		}
	}
	return -1;  

}


/*
*function: update the client list, if it does not exist, push it to the back
*input: String user_id
*		Date   expires  new date
*output: none
*/
updateClient = function(user_id, expires) {
	var i = getClientIndex(user_id);
	if( i == -1 ) 					// client does not exist
	{	
		clients.push(new User(user_id,expires));	//push one to the back
	}
	else
	{
		if(clients[i].id == user_id)			//client exist
		{
			clients[i].expires = expires;		//update the expiration date
		}
	}
}

/*
*function: update online client list by req
*input: Request req 
*output: none
*/
updateOnlineList = function(req)
{
	if(typeof(req.session.user) == 'undefined')
	{
		return -1;
	}
	else
	{
		updateClient(req.session.user['user_id'],req.session.cookie.expires);
		return 1;
	}
}

/*
*function: initiatively logout the client, removing the expired client from the list
*input: String user_id
*output: none
*/
logoutClient = function(user_id) {
	var i = getClientIndex(user_id); 		//get the index
	if (i >= 0) { 
		clients.splice(i, 1); 				//remove it
		//return true; 
	}
}


/*
*function: set up callback function for logout signal
*input: String user_id
*output: none
*/
onClientLogout = function(callback)
{
	ticker.on('logout',function(user_id){
		callback(user_id);
	})
}


exports.getClientIndex = getClientIndex;
exports.updateClient = updateClient;
exports.logoutClient = logoutClient;
exports.onClientLogout = onClientLogout;
exports.updateOnlineList = updateOnlineList;