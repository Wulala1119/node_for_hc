var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
	//res.render('index', { title: 'Express' });
 	//fs.readFile('views/index.html', function(err, data) {
 	res.redirect('/login');
});

router.get('/login', function(req, res) {
	//res.render('index', { title: 'Express' });
 	//fs.readFile('views/index.html', function(err, data) {
 	fs.readFile('views/login.html', function(err, data) {
 		if(err) console.log(err);
		res.end(data);
	});
});

router.get('/index',function(req,res) {
	fs.readFile('views/index.html', function(err, data) {
		if(err) console.log(err);
		res.end(data);
	});
});
module.exports = router;
