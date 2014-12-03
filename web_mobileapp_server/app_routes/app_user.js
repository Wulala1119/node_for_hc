var express = require('express')
	, router = express.Router()
	, session = require('express-session')
	, userManager = require('../middleware/user_manager/userManager.js');

/* GET users listing. */
/*user.getUserList( function (err, user) {
	if(!err) console.log(user);
	else console.log(err);
});*/

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/login',function(req,res) {
	var req_content = JSON.parse(req.body.text);
	res.writeHead(200, {   'Content-Type': 'application/json',
                                'Cache-Control': 'no-cache',
                                'Connection': 'keep-alive',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Credentials': 'true'
				});
	userManager.login(	req_content.user_id
						,req_content.password
						,onLogin
						,req
						,res
					);
});

function onLogin(err,login,user, req, res) {
	var req_content = JSON.parse(req.body.text);
	if(!err)
	{
		console.log("app login handler..." + login);
		if(login == 0)
		{
			console.log(req_content.user_id + " login at " + Date() );
			req.session.user = { "user_id" : user.userID,
								 "permission" : user.permission };
			req.session.loggedIn = true;
			req.session.count = 0;
			//console.log(req.session);
			userManager.refreshSessionList(req);

	        res.end(JSON.stringify( {
	            login:0
	        }));
		}
		else if(login == 1)		//already login
		{
			if(req.session.loggedIn == true)	//already login with the same IP address
			{
				res.end(JSON.stringify( {
	            	login:0
	        	}));
			}
			else
			{
				res.end(JSON.stringify( {	//already login somewhere else!
            		login:1
	        	}));
			}
		}
		else if(login == 2)	//password error
		{
			res.end(JSON.stringify( {
          		login:2
        	}));
		}
		//console.log(req.body.user_id + " login failed, password error" );		
	}
	else
	{
		console.log("login error: " + err);
	}
}

function updateOnlineList(req)
{
	onlienList.updateClient(req.session.user['user_id'],req.session.expires);
}
module.exports = router;
