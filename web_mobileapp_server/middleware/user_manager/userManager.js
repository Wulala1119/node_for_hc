var mongoose = require( 'mongoose' )			//database api module
	, User = mongoose.model( 'User' )			//model of user
	, onlineList = require('./onlineList.js');	//tracking valid sessions

/*
* set up callback function for logout event
*/
onlineList.onClientLogout (function(user_id){
	logout(user_id);			//clear the login flag in database
	console.log(user_id + ' log out!!!! ');
});

/*
*function: initialize the database on the start up of the server
*input: none
*output: none
*/
var initDB = function(){		//so far the action is to clear all the login flag when the server start
	User.update(
		{},
		{ $set: {login:false} },
		function(err)
		{
			if(!err)	console.log("database initialized...");
			else 		console.log("database initialization error: " + err);
		}
	);	
}
initDB();				//action


/*
*function:  user login, update the login flag in the database
*input: String userid
*		String password
*       function callback   callback function name
*       HttpRequest req     http request from the browser
*		HttpResponse res    http response to the browser
*output: passing parameters to callback function
*		 err, error handle
*        login, login flag, 0: login successfully, 1: already login somewhereelse, 2:id or password error
*	     user, user instance that containing data of the user from the database
*		 req, http request from the browser
*		 res, http response to the browser
*/
exports.login = function (userid, password, callback, req, res) {
	//console.log("login ueser: " + userid);
	User.findOne({'userID' : userid}, null, function(err, user){	// access the specific user
		var login;					//login flag
		if(user == null)
		{
			console.log(userid + ' does not exist');
			login = 2;		//id or password error	
		}
		else if(user.password == password)	//password match
		{
			if(user.login == false)		//user hasn't logged in
			{
				login = 0;				//set flag login successfully
				User.update(			//update login time and flag
					{_id:user._id},
					{ $set: {lastLogin: Date.now(), login:true} },
					function(err) {
						//console.log("update login status");
					}
				);
			}
			else 		//user already logged in
			{
				console.log(userid + " already logged in.");
				login = 1;
			}	
		}
		else 			//password does not match
		{
			console.log("password error.");
			login = 2;	//id or password error
		}

		if(callback != 'undefined') callback(err,login,user,req,res);	
	});
};


/*
* function: log out the user
* input: String userid
*		 function callback
*		 HttpRequest req
*		 HttpResponse res 
* output: passing parameters to callback function
*/
function logout(userid, callback, req, res) {
	User.update(	{userID:userid},
					{ $set: {login:false} },
					function(err) {
						if(err)
						{
							console.log('logout db update error: ' + err);
						}
						if( typeof(callback) != 'undefined' )   callback(err,req,res);	
					}
				);
};
exports.logout = logout;


/*
* function: access the permission of the user
* input: String userid
*		 function callback
*		 HttpRequest req
*		 HttpResponse res 
* output: passing parameters to callback function
*/
exports.getPermission = function (userid, callback, req, res) {

};


/*
* function: create new account for the a user
* input: Array user_info   array that containing the user info
*		 function callback
*		 HttpRequest req
*		 HttpResponse res 
* output: passing parameters to callback function
*/
exports.createUser = function (user_info, callback, req, res) {
	//console.log("new user creation reusest recieved...");
	//console.log(user_info);
	User.create({
		userID: user_info['userID'],
		password: user_info['password'],
		name: user_info['name'],
		permisison: user_info['permission'],
		login: false,
		modifiedOn: Date.now(),
		},
		function(err, user){
			callback(err, user, req, res);
		}
	);
};

/*
* function: remove a user account
* input: String userid
*		 function callback
*		 HttpRequest req
*		 HttpResponse res 
* output: passing parameters to callback function
*/
exports.removeUser = function (user_id, callback, req, res) {

};


/*
* function: modify the information of a user
* input: Array user_info   array that containing new info
*		 function callback
*		 HttpRequest req
*		 HttpResponse res 
* output: passing parameters to callback function
*/
exports.editUser = function (user_info, callback, req, res) {

};


/*
* function: modify the information of a user
* input: function callback
*		 HttpRequest req
*		 HttpResponse res 
* output: passing parameters to callback function
*			return the user list which is an array
*/
exports.getUserList = function ( callback, req, res) {
	User.find({},
		function(err, userlist)
		{
			callback(err, userlist, req, res);
		}
	)
};


/*
* function: update the online client session list
* input: HttpRequest req
* output: passing parameters to callback function
*/
exports.refreshSessionList = function (req){
	return onlineList.updateOnlineList(req);
};