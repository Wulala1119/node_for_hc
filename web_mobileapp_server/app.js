var express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')
    , bodyParser = require('body-parser')
    , db = require('./db/db')
    , routes = require('./routes/index')
    , users = require('./routes/users')
    , update = require('./routes/update')
    , controller = require('./routes/controller')
    , appTest = require("./app_routes/test")
    , appUsers = require("./app_routes/app_user")
    , appUpdate = require("./app_routes/app_update")
    , appController = require("./app_routes/app_controller");

var app = express();
var app_server = require('./app_server/appServer');
var server;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({user : {},
                loggedIn : "" ,
                count : "",
                resave:true,
                saveUninitialized:false,
                rolling: true,
                secret: 'keyboard cat',
                cookie:{maxAge:60000}
        }));

/* Web Services Routers */
app.use('/', routes);
app.use('/update',update);
app.use('/controller',controller);
app.use('/users', users);

/* Mobile App Services Routers */
app.use('/app/test',appTest);
app.use('/app/users',appUsers);
app.use('/app/update',appUpdate);
app.use('/app/controller',appController);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app_server.createAppServer();

module.exports = app;
