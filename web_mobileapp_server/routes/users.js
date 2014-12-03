var express = require('express')
	, router = express.Router()
	, session = require('express-session')
	, userManager = require('../middleware/user_manager/userManager.js')
	//, onlineList = require('../user_manager/onlineList.js')
	, fs = require('fs');

/* GET users listing. */
/*user.getUserList( function (err, user) {
	if(!err) console.log(user);
	else console.log(err);
});*/

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res) {
	fs.readFile('views/signup.html', function(err, data) {
		res.end(data);
	});
});

router.post('/login',function(req,res) {
	userManager.login(	req.body.user_id
						,req.body.password
						,onLogin
						,req
						,res
					);
});

function onLogin(err,login,user, req, res) {
	if(!err)
	{
		if(login == 0)
		{
			console.log(req.body.user_id + " login at " + Date() );
			req.session.user = { "user_id" : user.userID,
								 "permission" : user.permission };
			req.session.loggedIn = true;
			req.session.count = 0;
			res_redirect(res,'/index');
			//console.log(req.session);
			userManager.refreshSessionList(req);
		}
		if(login == 1)		//already login
		{
			if(req.session.loggedIn == true)
			{
				console.log(req.session.user_id + ' already logged in, session has not expired, redirecting');
				res_redirect(res,'/index');
			}
			else
			{
				res.end(JSON.stringify( {
	     			login:"already login somewhere else!"
	       		}));
			}
		}
		else if(login == 2)	//password error
		{
			res.end(JSON.stringify( {
	     		login:"password error!"
	       	}));
		}
		//console.log(req.body.user_id + " login failed, password error" );	
	}
	else
	{
		console.log("login error: " + err);
	}
}

router.post('/create', function(req, res) {
	var user_info = {};
	user_info = {'userID' : req.body.user_id,
				'password' : req.body.password,
				'name' : req.body.name,
				'permission' : req.body.permission }

	userManager.createUser(user_info, onUserCreated, req, res);
});

///////////////function run when the usr creation is done////////////////
function onUserCreated(err, user, req, res) {
	if(!err)
	{
		console.log("new user created: " + user.userID);
	}
	else
	{
		console.log(req.body.user_id + ' creation failed for the reason: ');
		if(0)//(err.code === 11000)		//duplcated key(userID) value
		{
			console.log('user id was already existed');
		}
		else
		{
			console.log("creation error " + err);
		}	
	}

	res_redirect(res,'/');
	//res.redirect('/');
	//res.end();
}

function res_redirect(res, url)
{
	res.contentType('application/json');
	var data = JSON.stringify(url);
	res.header('Content-Length', data.length);
	res.end(data);
}

function updateOnlineList(req)
{
	onlienList.updateClient(req.session.user['user_id'],req.session.expires);
}
module.exports = router;
